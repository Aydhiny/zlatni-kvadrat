// Package logger provides a pre-configured zerolog instance.
package logger

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

// New creates and returns a configured zerolog.Logger.
// In development mode, output is pretty-printed to stdout.
// In production mode, output is JSON to stdout (structured for log aggregators).
func New() zerolog.Logger {
	env := os.Getenv("ENV")

	if env != "production" {
		return zerolog.New(zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		}).With().Timestamp().Caller().Logger()
	}

	return zerolog.New(os.Stdout).With().Timestamp().Logger()
}
