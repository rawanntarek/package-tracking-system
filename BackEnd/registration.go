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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// UserData Struct
type UserData struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
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
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS") // Include OPTIONS for preflight requests
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

	// Insert the user data into MongoDB
	collection := client.Database("Package_Tracking_System").Collection("Registered Users")
	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		ErrorResponse(w, "Error saving user to the database", http.StatusInternalServerError)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": fmt.Sprintf("User '%s' registered successfully!", user.Name),
		"user":    user.Email,
	})
}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	enableCORS(w) // Enable CORS for the request

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

	// Successful login response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Logged in successfully!",
		"user":    foundUser.Email})
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
