CREATE TABLE IF NOT EXISTS inquiries (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(50),
    message    TEXT,
    is_read    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiries_listing_id ON inquiries(listing_id);
CREATE INDEX idx_inquiries_is_read    ON inquiries(is_read) WHERE is_read = FALSE;
