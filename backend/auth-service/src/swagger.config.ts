import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions, OpenAPIObject } from "@nestjs/swagger";
import axios from "axios";

export const ConfigureSwaggerUI = async (app: INestApplication<any>) => {
    const config = new DocumentBuilder()
    .setTitle("Author Finder Service")
    .setDescription("API documentation for the Full Author Finder Service")
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
        swaggerOptions: { persistAuthorization: true, },
        customSiteTitle: "Unified API Documentation",
    };

    const authDocument = SwaggerModule.createDocument(app, config);
    let favoritesDocument;
    try {
        favoritesDocument = await axios.get<OpenAPIObject>(`${process.env.FAVORITE_SERVICE_SWAGGER_URL}`);
    } catch {
        favoritesDocument = { data: { paths: {}, components: {}, tags: [] } };
    }

    const mergedDocument: OpenAPIObject = {
        ...authDocument,
        paths: {
            ...authDocument.paths,
            ...favoritesDocument.data.paths,
        },
        components: {
            ...authDocument.components,
            schemas: {
                ...(authDocument.components?.schemas || {}),
                ...(favoritesDocument.data.components?.schemas || {}),
            },
            securitySchemes: {
                ...(authDocument.components?.securitySchemes || {}),
                ...(favoritesDocument.data.components?.securitySchemes || {}),
            },
        },
        tags: [
            ...(authDocument.tags || []),
            ...(favoritesDocument.data.tags || []),
        ],
    };

    SwaggerModule.setup('api', app, mergedDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Unified API Docs',
  });
}