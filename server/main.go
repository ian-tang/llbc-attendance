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

	http.HandleFunc("OPTIONS /new-visitor", submit.HandleSubmitPreflight)
	http.HandleFunc("OPTIONS /response", submit.HandleSubmitPreflight)
	http.HandleFunc("POST /new-visitor", submit.HandleSubmitNewUser)
	http.HandleFunc("POST /response", submit.HandleSubmitResponse)

	env, ok := envs["ENV"]
	if !ok {
		log.Fatal("Missing value from .env: ENV")
	}
	port, ok := envs["PORT"]
	if !ok {
		log.Fatal("Missing value from .env: PORT")
	}

	if env == "PROD" {
		cert, ok := envs["CERT_FILE"]
		if !ok {
			log.Fatal("Missing value from .env: CERT_FILE")
		}
		key, ok := envs["KEY_FILE"]
		if !ok {
			log.Fatal("Missing value from .env: KEY_FILE")
		}

		fmt.Printf("Listening on port %v\n", port)
		http.ListenAndServeTLS(":"+port, cert, key, nil)
		return
	}

	fmt.Printf("Listening on port %v\n", port)
	http.ListenAndServe(":"+port, nil)
}
