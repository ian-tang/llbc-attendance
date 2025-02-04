package db

import (
	"database/sql"
	"log"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

const dbFilePath = "DB_FILE_PATH"

func init() {
	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal(err)
	}

	dbPath, ok := envs[dbFilePath]
	if !ok {
		log.Fatalf("Could not find required value %v\n", dbFilePath)
	}

	conn, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	db = conn
	log.Print("DB initialized")
}

func New() *sql.DB {
	return db
}
