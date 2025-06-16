import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from "@nestjs/swagger";

const documentConfig = new DocumentBuilder()
    .setTitle("Author Finder Auth Service")
    .setDescription("API documentation for the Author Finder authentication service")
    .setVersion("1.0")
    .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Access token for user authentication",
        name: "Authorization",
        in: "header",
    }, "Access-Token")
    .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    }, "Refresh-Token")
    .addSecurityRequirements("Access-Token")
    .addSecurityRequirements("Refresh-Token")
    .build();

const swaggerUIOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        persistAuthorization: true,
    },
    customSiteTitle: "Author Finder Auth Service API",
    customJs: [],
    customCssUrl: [],
};

export const ConfigureSwaggerUI = (app: INestApplication<any>) => {
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('api', app, document, swaggerUIOptions);
}