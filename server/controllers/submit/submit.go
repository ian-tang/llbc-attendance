package submit

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"server/repositories/user"
)

func HandleSubmitPreflight(w http.ResponseWriter, _ *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")
	w.Header().Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func HandleSubmitNewUser(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")

	data, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(400)
		return
	}

	var userRes user.UserResponse

	err = json.Unmarshal(data, &userRes)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(400)
		return
	}
	fmt.Printf("%+v\n", userRes)

	if _, _, err = user.CreateUserAndResponse(userRes); err != nil {
		fmt.Println(err)
	}
	w.WriteHeader(201)
}

func HandleSubmitResponse(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")

	data, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(400)
		return
	}

	var userRes user.UserResponse

	err = json.Unmarshal(data, &userRes)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(400)
		return
	}
	fmt.Printf("%+v\n", userRes)

	if _, err = user.CreateResponse(userRes); err != nil {
		fmt.Println(err)
	}
	w.WriteHeader(201)
}
