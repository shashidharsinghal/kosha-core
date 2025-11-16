import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function setupSwagger(app: Express): void {
  // Load OpenAPI spec from YAML file
  const specPath = path.join(__dirname, 'openapi.yaml');
  const specFile = fs.readFileSync(specPath, 'utf8');
  const swaggerSpec = yaml.load(specFile) as object;

  // Serve Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Kosha API Documentation',
  }));

  // Serve OpenAPI spec as JSON
  app.get('/api/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(swaggerSpec, null, 2));
  });

  // Serve OpenAPI spec as YAML
  app.get('/api/openapi.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(specFile);
  });
}

