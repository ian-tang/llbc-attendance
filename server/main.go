package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

const PORT int = 8090

func submit(w http.ResponseWriter, req *http.Request) {

	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")
	w.Header().Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
	resJSON, _ := json.Marshal("received")
	w.Write(resJSON)

	data, _ := io.ReadAll(req.Body)
	req.Body.Close()
	fmt.Println(string(data))
}

func main() {

	http.HandleFunc("/submit", submit)

	fmt.Printf("Listening on port %d", PORT)
	http.ListenAndServe(":"+strconv.Itoa(PORT), nil)
}
