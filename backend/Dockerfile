FROM maven:3.9.11-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/target/argon-demo-0.1.0-SNAPSHOT.jar app.jar
ENV BIND_ADDRESS=0.0.0.0
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
