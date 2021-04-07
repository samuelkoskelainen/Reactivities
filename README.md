# Reactivities

- CRUD application that lets you browse, create, update and delete events
- includes login-system, chat feature, registering to events, following other users

## Architecture

- The application follows clean architecture by Robert C. Martin

![alt text](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

- Domain folder represents the Enterprice Business rules, or entities.
- Application folder represents the Application Business Rules layer, or use cases.
- Api folder represents the Interface Adapters layer, or controllers.
- Infrastructure, Persistence and client-app folders represent the Frameworks & drivers layer. this application uses Databases, ui, and external interfaces

