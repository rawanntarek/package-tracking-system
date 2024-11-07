package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// UserData Struct
type UserData struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"userid"`
	Name         string             `json:"name"`
	Email        string             `json:"email"`
	Phone        string             `json:"phone"`
	Password     string             `json:"password"`
	Type_of_user string             `json:"Type_of_user"`
}

type Order struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	PickupLocation  string             `json:"pickupLocation"`
	DropOffLocation string             `json:"dropOffLocation"`
	PackageDetails  string             `json:"packageDetails"`
	DeliveryTime    string             `json:"deliveryTime"`
	UserEmail       string             `json:"userEmail"`
	Status          string             `json:"status"`
	CourierID       string             `json:"courierID"`
	CourierName     string             `json:"courierName"`
	CourierPhone    string             `json:"courierPhone"`
}

// Global MongoDB client
var client *mongo.Client

// ErrorResponse sends an error message to the client.
func ErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	http.Error(w, message, statusCode)
}

// CORS middleware to handle cross-origin requests
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins (be cautious in production)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, email,id,orderID,courierID")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE,GET ,POST, OPTIONS") // Include OPTIONS for preflight requests
}

// UserRegisteration handles the user registration process.
func UserRegisteration(w http.ResponseWriter, r *http.Request) {
	enableCORS(w) // Enable CORS for the request

	if r.Method == http.MethodOptions {
		return // Handle preflight request
	}

	// Log the incoming request method and URL
	log.Printf("Received %s request for %s", r.Method, r.URL.Path)

	var user UserData
	body, err := io.ReadAll(r.Body)
	if err != nil {
		ErrorResponse(w, "Error reading input", http.StatusInternalServerError)
		return
	}

	// Unmarshal the JSON body into UserData struct
	err = json.Unmarshal(body, &user)
	if err != nil {
		ErrorResponse(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if user.Email == "" || user.Password == "" || user.Name == "" || user.Phone == "" || user.Type_of_user == "" {
		ErrorResponse(w, "fields are required", http.StatusBadRequest)
		return
	}
	// Insert the user data into MongoDB
	collection := client.Database("Package_Tracking_System").Collection("Registered Users")
	filter := bson.M{"email": user.Email}

	// Attempt to find the user
	var ExistingUser UserData
	err = collection.FindOne(context.TODO(), filter).Decode(&ExistingUser)
	if err == nil {
		ErrorResponse(w, "user Already Registered", http.StatusUnauthorized)
		return
	}

	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		ErrorResponse(w, "Error saving user to the database", http.StatusInternalServerError)
		return
	} else {
		ErrorResponse(w, "User Registered Successfully", http.StatusOK)

	}

}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	enableCORS(w) // Enable CORS for the request

	if r.Method == http.MethodOptions {
		return // Handle preflight request
	}

	// Log the incoming request method and URL
	log.Printf("Received %s request for %s", r.Method, r.URL.Path)
	// Read the incoming request
	var user UserData
	body, err := io.ReadAll(r.Body)
	if err != nil {
		ErrorResponse(w, "Error reading input", http.StatusInternalServerError)
		return
	}

	// Unmarshal JSON body into UserData struct
	err = json.Unmarshal(body, &user)
	if err != nil {
		ErrorResponse(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Check if email and password are provided
	if user.Email == "" || user.Password == "" {
		ErrorResponse(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Query MongoDB to check if user exists with the provided email and password
	collection := client.Database("Package_Tracking_System").Collection("Registered Users")
	filter := bson.M{"email": user.Email, "password": user.Password}

	// Attempt to find the user
	var foundUser UserData
	err = collection.FindOne(context.TODO(), filter).Decode(&foundUser)
	if err == mongo.ErrNoDocuments {
		ErrorResponse(w, "Invalid email or password", http.StatusUnauthorized)
		return
	} else if err != nil {
		ErrorResponse(w, "Error checking credentials", http.StatusInternalServerError)
		return
	}

	// Create response data with the user role
	responseData := map[string]interface{}{
		"message":  "User logged in successfully",
		"role":     foundUser.Type_of_user, // Send the role of the user
		"userID":   foundUser.ID.Hex(),
		"username": foundUser.Name,
		"phone":    foundUser.Phone,
	}

	// Set the response status to OK (only once)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(responseData) // Send the response body
}

func CreateOrder(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		return // Handle preflight request
	}

	log.Printf("Received %s request for %s", r.Method, r.URL.Path)

	var order Order
	body, err := io.ReadAll(r.Body)
	if err != nil {
		ErrorResponse(w, "Error reading input", http.StatusInternalServerError)
		return
	}

	// Unmarshal the request body into the Order struct
	err = json.Unmarshal(body, &order)
	if err != nil {
		ErrorResponse(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Check if all required fields are provided
	if order.PickupLocation == "" || order.DropOffLocation == "" || order.PackageDetails == "" || order.DeliveryTime == "" || order.UserEmail == "" {
		ErrorResponse(w, "All fields are required", http.StatusBadRequest)
		return
	}
	order.Status = "pending"
	// Insert the order into the database
	collection := client.Database("Package_Tracking_System").Collection("Orders")
	result, err := collection.InsertOne(context.TODO(), order)
	if err != nil {
		ErrorResponse(w, "Error saving order to the database", http.StatusInternalServerError)
		return
	}
	order.ID = result.InsertedID.(primitive.ObjectID)
	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Order Created Successfully"))
}

func GetUserOrders(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	email := r.Header.Get("email")

	if email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}
	log.Printf("Received %s request for %s", r.Method, r.URL.Path)

	collection := client.Database("Package_Tracking_System").Collection("Orders")

	// Filter orders by email
	filter := bson.M{"useremail": email}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}

	var orders []Order
	if err := cursor.All(context.TODO(), &orders); err != nil {
		http.Error(w, "Error processing orders", http.StatusInternalServerError)
		return
	}

	if len(orders) == 0 {
		w.WriteHeader(http.StatusOK) // No orders found
		w.Write([]byte("[]"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}
func GetAllOrders(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	log.Printf("Received %s request for %s", r.Method, r.URL.Path)

	collection := client.Database("Package_Tracking_System").Collection("Orders")

	// Fetch all orders without any filter
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}

	var orders []Order
	if err := cursor.All(context.TODO(), &orders); err != nil {
		http.Error(w, "Error processing orders", http.StatusInternalServerError)
		return
	}

	// Send the orders as a JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

// Function to handle getting an order by ID
func GetOrderById(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	orderID := r.Header.Get("id")
	if orderID == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	oid, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		http.Error(w, "Invalid Order ID", http.StatusBadRequest)
		return
	}

	collection := client.Database("Package_Tracking_System").Collection("Orders")
	var order Order
	err = collection.FindOne(context.TODO(), bson.M{"_id": oid}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Order not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to fetch order", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}
func CancelOrder(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	orderID := r.Header.Get("id")
	if orderID == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	oid, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		http.Error(w, "Invalid Order ID", http.StatusBadRequest)
		return
	}

	collection := client.Database("Package_Tracking_System").Collection("Orders")
	_, err = collection.DeleteOne(context.TODO(), bson.M{"_id": oid})
	if err != nil {
		http.Error(w, "Failed to delete order", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Order deleted successfully"))
}
func AcceptOrder(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	orderID := r.Header.Get("orderID")
	courierID := r.Header.Get("courierID")
	if orderID == "" || courierID == "" {
		http.Error(w, "Order ID and Courier ID are required", http.StatusBadRequest)
		return
	}

	// Parse the order ID and courier ID to MongoDB ObjectID format
	orderOID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		http.Error(w, "Invalid Order ID format", http.StatusBadRequest)
		return
	}
	courierOID, err := primitive.ObjectIDFromHex(courierID)
	if err != nil {
		http.Error(w, "Invalid Courier ID format", http.StatusBadRequest)
		return
	}

	// Fetch courier details from the database
	courierCollection := client.Database("Package_Tracking_System").Collection("Registered Users")
	var courier UserData
	err = courierCollection.FindOne(context.TODO(), bson.M{"_id": courierOID}).Decode(&courier)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Courier not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to fetch courier details", http.StatusInternalServerError)
		}
		return
	}

	// Access the Orders collection and update the order document
	orderCollection := client.Database("Package_Tracking_System").Collection("Orders")
	filter := bson.M{"_id": orderOID}
	update := bson.M{
		"$set": bson.M{
			"courierID":    courier.ID.Hex(),
			"courierName":  courier.Name,
			"courierPhone": courier.Phone,
			"status":       "accepted",
		},
	}

	result, err := orderCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Printf("Error updating order: %v", err)
		http.Error(w, "Failed to accept order", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Order accepted successfully"))
}

func DeclineOrder(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	orderID := r.URL.Query().Get("orderID")
	if orderID == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	oid, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		http.Error(w, "Invalid Order ID", http.StatusBadRequest)
		return
	}

	collection := client.Database("Package_Tracking_System").Collection("Orders")
	filter := bson.M{"_id": oid}
	update := bson.M{
		"$set": bson.M{
			"courierID":    "",
			"courierName":  "",
			"courierPhone": "",
			"status":       "pending",
		},
	}

	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, "Failed to decline order", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Order declined successfully"))
}

func main() {
	// MongoDB URI
	uri := "mongodb+srv://roaaayman2112:1234@cluster0.66yq8.mongodb.net/Package_Tracking_System?retryWrites=true&w=majority"
	clientOptions := options.Client().ApplyURI(uri)

	// Connect to MongoDB
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Connection Error:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Start the HTTP server
	const port = ":3000" // Define port for server
	http.HandleFunc("/register", UserRegisteration)
	http.HandleFunc("/login", UserLogin)
	http.HandleFunc("/createorder", CreateOrder)
	http.HandleFunc("/getuserorders", GetUserOrders)
	http.HandleFunc("/getallorders", GetAllOrders)

	http.HandleFunc("/getorder", GetOrderById)
	http.HandleFunc("/cancelorder", CancelOrder)
	http.HandleFunc("/acceptorder", AcceptOrder)
	http.HandleFunc("/declineorder", DeclineOrder)

	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil)) // Start the server and log fatal errors

	// Disconnect from MongoDB on server shutdown
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			log.Fatal("Disconnect Error:", err)
		}
		fmt.Println("Disconnected from MongoDB.")
	}()
}
