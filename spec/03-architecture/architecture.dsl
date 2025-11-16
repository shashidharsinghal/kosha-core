// Structurizr DSL for the Kosha application
workspace "Kosha – Personal Finance" "High‑level architecture" {
  model {
    user = person "User" {
      description "An end user managing personal finances"
    }

    softwareSystem kosha "Kosha Application" {
      container webApp "Web/Mobile App" "React/Next.js or React Native" {
        description "Client‑side application where users view dashboards, manage bills, expenses, income and investments."
      }
      container backend "Backend API" "Node.js + TypeScript (spec‑kit)" {
        description "Exposes REST/GraphQL endpoints for all features including dashboard/analytics. Handles authentication, business logic and orchestrates external integrations. Provides endpoints for bills, expenses, income, investments, payments, notifications and dashboard summaries."
      }
      container mongoDB "MongoDB" "Database" {
        description "Document store for flexible, semi-structured collections: bills, income entries, expenses and notifications. Allows dynamic schemas and rapid iteration. Used for data that doesn't require strict relational integrity."
      }
      container postgres "PostgreSQL" "Relational Database" {
        description "Relational store for structured entities requiring ACID guarantees and complex queries: users, sessions, investment portfolios (assets, transactions, prices), UPI accounts, payments and mandates. Supports joins and transactional consistency."
      }
      container redis "Redis" "In‑memory Cache" {
        description "Caching layer for frequently accessed data (e.g. dashboard summaries, recently imported bills, session tokens). Also used as message queue for asynchronous task processing."
      }
      container messageQueue "Message Queue" "Redis Queue / RabbitMQ" {
        description "Message queue for asynchronous communication between backend and microservices. Handles task queuing for Gmail imports, payment processing, and notification delivery."
      }
      container gmailService "Gmail Integration Service" "Microservice" {
        description "Polls the user's Gmail via Gmail API, parses bill notifications and income emails, then writes to MongoDB. Consumes tasks from message queue. Runs asynchronously as a background worker."
      }
      container paymentService "Payment Integration Service" "Microservice" {
        description "Handles UPI Autopay and one‑time payments via UPI providers such as Razorpay/PayU. Manages mandates and payment callbacks. Receives payment requests via HTTP from backend and processes asynchronously."
      }
      container notificationService "Notification Service" "Microservice" {
        description "Schedules and sends email/SMS/push notifications for bill reminders, payment confirmations and insights. Consumes notification tasks from message queue and respects user preferences and DND settings."
      }
    }
    externalSystem gmail "Gmail" {
      description "Google’s email service, accessed via OAuth and Gmail API."
    }
    externalSystem upiProvider "UPI Provider" {
      description "Bank/PSP implementing UPI Autopay and payment APIs (e.g. Razorpay, PayU)."
    }
    externalSystem marketData "Market Data API" {
      description "Third‑party service providing investment price data (stocks, mutual funds)."
    }

    // Relationships
    user -> kosha.webApp "Uses" "HTTPS"
    kosha.webApp -> kosha.backend "Calls API" "REST/GraphQL"
    kosha.backend -> kosha.mongoDB "Reads/Writes" "ODM (Mongoose)"
    kosha.backend -> kosha.postgres "Reads/Writes" "SQL (Prisma/TypeORM)"
    kosha.backend -> kosha.redis "Reads/Writes" "Redis protocol"
    kosha.backend -> kosha.messageQueue "Publishes tasks" "Redis Queue / RabbitMQ"
    kosha.backend -> kosha.gmailService "Initiates import" "HTTP (optional direct call)"
    kosha.backend -> kosha.messageQueue "Enqueues Gmail tasks" "Message queue"
    kosha.messageQueue -> kosha.gmailService "Delivers tasks" "Message queue"
    kosha.gmailService -> gmail "Fetches emails" "Gmail API"
    kosha.gmailService -> kosha.mongoDB "Writes bills/incomes" "ODM"
    kosha.backend -> kosha.paymentService "Initiates payments" "HTTP"
    kosha.paymentService -> upiProvider "Processes UPI payments" "UPI Autopay API"
    kosha.paymentService -> kosha.postgres "Updates payment status" "SQL"
    kosha.backend -> kosha.messageQueue "Enqueues notifications" "Message queue"
    kosha.messageQueue -> kosha.notificationService "Delivers notifications" "Message queue"
    kosha.notificationService -> gmail "Sends email notifications" "SMTP/Gmail API"
    kosha.notificationService -> kosha.mongoDB "Updates notification status" "ODM"
    kosha.backend -> marketData "Fetches live prices" "HTTPS"
  }

  views {
    systemContext kosha "Context diagram" {
      include *
      autolayout lr
    }
    container kosha "Container diagram" {
      include kosha.*
      include user
      include gmail
      include upiProvider
      include marketData
      autolayout lr
    }
    styles {
      element "Person" { shape person; background "#f6c7c7" }
      element "Container" { shape roundedbox; background "#a7c7e7" }
      element "ExternalSystem" { shape hexagon; background "#e0e0e0" }
      relationship { routing direct; }
    }
  }
}