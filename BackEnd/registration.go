package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

// UserData Struct
type UserData struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

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

// UserValidation checks if all required fields are filled.
func UserValidation(user UserData) (bool, string) {
	if user.Name == "" {
		return false, "name"
	}
	if user.Email == "" {
		return false, "email"
	}
	if user.Phone == "" {
		return false, "phone"
	}
	if user.Password == "" {
		return false, "password"
	}
	return true, ""
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

	// Validate user data
	valid, missingField := UserValidation(user)
	if !valid {
		ErrorResponse(w, fmt.Sprintf("Field '%s' is required", missingField), http.StatusBadRequest)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": fmt.Sprintf("User '%s' registered successfully!", user.Name),
		"user":    user.Email,
	})
}

func main() {
	const port = ":3000" // Define port for server

	http.HandleFunc("/register", UserRegisteration)

	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil)) // Start the server and log fatal errors
}
