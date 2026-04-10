// MongoDB initialization script
// This script runs when the container starts for the first time

// Switch to the eventbooking database
db = db.getSiblingDB('eventbooking');

// Create a user for the eventbooking database
db.createUser({
  user: 'eventuser',
  pwd: 'eventpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'eventbooking'
    }
  ]
});

// Create some initial collections (optional)
db.createCollection('events');
db.createCollection('bookings');

print('✅ MongoDB initialization completed for eventbooking database');