package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// Connects to MongoDB and inserts a document into a collection
func insertData(client *mongo.Client, data map[string]interface{}) error {
    // Choose your database and collection
    collection := client.Database("packagetrainingsystem").Collection("register")

    // Insert data (converted to BSON format)
    insertResult, err := collection.InsertOne(context.TODO(), data)
    if err != nil {
        return fmt.Errorf("Insert Error: %w", err)
    }

    fmt.Println("Inserted document with ID:", insertResult.InsertedID)
    return nil
}

func main() {
    uri := "mongodb+srv://roaaayman2112:1234@cluster0.66yq8.mongodb.net/"
    clientOptions := options.Client().ApplyURI(uri)

    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal("Connection Error:", err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err = client.Ping(ctx, nil); err != nil {
        log.Fatal("Ping Error:", err)
    }
    fmt.Println("Connected to MongoDB!")

    // Example data to insert
    data := map[string]interface{}{
        "name":  "John Doe",
        "email": "john@example.com",
        "age":   29,
    }

    if err := insertData(client, data); err != nil {
        log.Fatal("Insert Data Error:", err)
    }

    defer func() {
        if err = client.Disconnect(ctx); err != nil {
            log.Fatal("Disconnect Error:", err)
        }
    }()
}
