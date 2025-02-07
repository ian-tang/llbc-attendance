package main

import (
	"fmt"
	"log"
	"net/http"
	"server/controllers/submit"
	sqliteDB "server/db"

	"github.com/joho/godotenv"
)

func main() {
	db := sqliteDB.New()
	defer db.Close()

	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal(err)
	}

	port, ok := envs["PORT"]
	if !ok {
		log.Fatal("Missing value from .env: PORT")
	}

	http.HandleFunc("OPTIONS /new-visitor", submit.HandleSubmitPreflight)
	http.HandleFunc("OPTIONS /response", submit.HandleSubmitPreflight)
	http.HandleFunc("POST /new-visitor", submit.HandleSubmitNewUser)
	http.HandleFunc("POST /response", submit.HandleSubmitResponse)

	fmt.Printf("Listening on port %v\n", port)
	http.ListenAndServe(":"+port, nil)
}
