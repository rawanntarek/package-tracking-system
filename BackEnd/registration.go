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
	var user UserData
	body, err := io.ReadAll(r.Body)
	if err != nil {
		ErrorResponse(w, "Error reading input", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &user)
	if err != nil {
		ErrorResponse(w, "Invalid input", http.StatusBadRequest)
		return
	}

	valid, missingField := UserValidation(user)
	if !valid {
		ErrorResponse(w, fmt.Sprintf("Field '%s' is required", missingField), http.StatusBadRequest)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User'%user.name registered successfully!",
		"user":    user.Email,
	})
}

func main() {
	const port = ":8080"

	http.HandleFunc("/register", UserRegisteration)

	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
