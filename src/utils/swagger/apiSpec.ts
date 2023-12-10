import swaggerJsdoc from "swagger-jsdoc";
import apiSpecJson from "../../../api-spec.json";

const apiSpec = swaggerJsdoc({
  definition: apiSpecJson,
  apis: [],
});

export default apiSpec;
