CREATE TABLE IF NOT EXISTS listings (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(500) NOT NULL,
    description   TEXT,
    type          VARCHAR(20)  NOT NULL CHECK (type IN ('sale', 'rent')),
    property_type VARCHAR(50)  NOT NULL CHECK (property_type IN ('apartment', 'house', 'commercial', 'land')),
    price         DECIMAL(15,2) NOT NULL,
    currency      VARCHAR(10)  NOT NULL DEFAULT 'EUR',
    area          DECIMAL(10,2),
    bedrooms      INT,
    bathrooms     INT,
    location      VARCHAR(255),
    address       VARCHAR(500),
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    images        TEXT[]       NOT NULL DEFAULT '{}',
    is_featured   BOOLEAN      NOT NULL DEFAULT FALSE,
    is_available  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_type         ON listings(type);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_location      ON listings(location);
CREATE INDEX idx_listings_is_featured   ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_listings_is_available  ON listings(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_listings_price         ON listings(price);
