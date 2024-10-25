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
        "user":    foundUser.Email,
    })
}
