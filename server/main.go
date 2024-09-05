package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func submit(w http.ResponseWriter, req *http.Request) {

	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")
	resJSON, _ := json.Marshal("received")
	w.Write(resJSON)

	data, _ := io.ReadAll(req.Body)
	req.Body.Close()
	fmt.Println(string(data))
}

func main() {

	http.HandleFunc("/submit", submit)

	http.ListenAndServe(":8090", nil)
}
