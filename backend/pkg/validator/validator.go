// Package validator wraps go-playground/validator with custom rules.
package validator

import "github.com/go-playground/validator/v10"

// New creates and returns a configured validator instance.
// Register any custom validation rules here.
func New() *validator.Validate {
	v := validator.New()
	// Register custom validators here as needed, e.g.:
	// v.RegisterValidation("bosnian_phone", validateBosnianPhone)
	return v
}
