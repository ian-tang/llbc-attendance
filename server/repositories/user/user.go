package user

import (
	"database/sql"
	sqliteDB "server/db"
)

var db *sql.DB = sqliteDB.New()

const qCreateUser = `
	insert into users (first_name, last_name, email, newsletter, photo_release, creation_time)
	values (?, ?, ?, ?, ?, datetime());
`

const qGetUserByEmail = `
	select id, first_name, last_name, email, newsletter, photo_release, creation_time
	from users
	where email = ?;
`

const qCreateResponse = `
	insert into user_responses
	(user_id, first_visit, role_volunteer, role_get_assistance, role_purchase, role_donate, submission_time)
	values (?, ?, ?, ?, ?, ?, datetime());
`

type User struct {
	ID           int64
	FirstName    string
	LastName     string
	Email        string
	Newsletter   bool
	PhotoRelease bool
	CreationTime string
}

type UserResponse struct {
	FirstName    string `json:"first-name"`
	LastName     string `json:"last-name"`
	Email        string `json:"email"`
	Newsletter   bool   `json:"newsletter"`
	PhotoRelease bool   `json:"photo-release"`
	VisitorRole  struct {
		Volunteer     bool `json:"volunteer"`
		GetAssistance bool `json:"get-assistance"`
		Purchase      bool `json:"purchase-parts-bikes"`
		Donate        bool `json:"donate-parts-bikes"`
	} `json:"visitor-role"`
	FirstVisit bool `json:"first-visit"`
}

func CreateUser(r UserResponse) (userID int64, err error) {
	res, err := db.Exec(
		qCreateUser,
		r.FirstName,
		r.LastName,
		r.Email,
		r.Newsletter,
		r.PhotoRelease,
	)

	if err != nil {
		return 0, err
	}
	userID, _ = res.LastInsertId()
	return userID, err
}

func GetUserByEmail(email string) (u User, err error) {
	err = db.QueryRow(qGetUserByEmail, email).Scan(
		&u.ID,
		&u.FirstName,
		&u.LastName,
		&u.Email,
		&u.Newsletter,
		&u.PhotoRelease,
		&u.CreationTime,
	)
	if err != nil {
		return User{}, err
	}
	return u, err
}

func CreateUserAndResponse(r UserResponse) (userID int64, resID int64, err error) {
	fail := func(err error) (int64, int64, error) {
		return 0, 0, err
	}

	tx, err := db.Begin()
	if err != nil {
		return fail(err)
	}
	defer tx.Rollback()

	res, err := tx.Exec(
		qCreateUser,
		r.FirstName,
		r.LastName,
		r.Email,
		r.Newsletter,
		r.PhotoRelease,
	)
	if err != nil {
		return fail(err)
	}
	userID, _ = res.LastInsertId()

	res, err = tx.Exec(
		qCreateResponse,
		userID,
		r.FirstVisit,
		r.VisitorRole.Volunteer,
		r.VisitorRole.GetAssistance,
		r.VisitorRole.Purchase,
		r.VisitorRole.Donate,
	)
	if err != nil {
		return fail(err)
	}
	resID, _ = res.LastInsertId()

	if err = tx.Commit(); err != nil {
		return fail(err)
	}

	return userID, resID, err
}

func CreateResponse(r UserResponse) (resID int64, err error) {
	user, err := GetUserByEmail(r.Email)
	if err != nil {
		return 0, err
	}

	res, err := db.Exec(
		qCreateResponse,
		user.ID,
		r.FirstVisit,
		r.VisitorRole.Volunteer,
		r.VisitorRole.GetAssistance,
		r.VisitorRole.Purchase,
		r.VisitorRole.Donate,
	)
	if err != nil {
		return 0, err
	}

	resID, _ = res.LastInsertId()

	return resID, err
}
