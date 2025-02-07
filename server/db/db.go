package db

import (
	"database/sql"
	"log"

	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
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

	conn, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	db = conn
	createTables()
	log.Print("DB initialized")
}

func createTables() {
	createUsersTbl := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER NOT NULL PRIMARY KEY,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		newsletter BOOLEAN NOT NULL,
		photo_release BOOLEAN NOT NULL,
		creation_time TEXT NOT NULL
	);
`
	createResponsesTbl := `
	CREATE TABLE IF NOT EXISTS user_responses (
		id INTEGER NOT NULL PRIMARY KEY,
		user_id INTEGER NOT NULL,
		role_volunteer BOOLEAN NOT NULL,
		role_get_assistance BOOLEAN NOT NULL,
		role_purchase BOOLEAN NOT NULL,
		role_donate BOOLEAN NOT NULL,
		first_visit BOOLEAN NOT NULL,
		submission_time TEXT NOT NULL,
		FOREIGN KEY (user_id)
			REFERENCES users (id)
	);
`
	_, err := db.Exec(createUsersTbl)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(createResponsesTbl)
	if err != nil {
		log.Fatal(err)
	}
}

func New() *sql.DB {
	return db
}
