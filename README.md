# API Spec Quickstart

## Introduction

This README provides guidance on deploying and using the API Spec Quickstart, a tool designed to accelerate fullstack application development by enabling front-end developers to easily build and interact with APIs. Inspired by the concept of front-end enablement, this tool offers a user-friendly approach to creating and using API specifications, focusing on improving the UI/UX development process.

To read more about how to use this repository, [check out the blog post](https://readysetcloud.io/blog/allen.helton/json-to-working-api-in-seconds).

## Prerequisites

- AWS account
- SAM CLI installed

## Deployment

1. **Clone the Repository**: Clone the `api-spec-quickstart` repository from GitHub to your local machine.

   ```bash
   git clone https://github.com/allenheltondev/api-spec-quickstart.git
   ```

2. **Navigate to the Project Directory**: Change your directory to the cloned repository.

   ```bash
   cd api-spec-quickstart
   ```

3. **Build the Project Using SAM CLI**: Use the SAM CLI to build your project.

   ```bash
   sam build
   ```

4. **Deploy the Project**: Deploy your application to AWS using the SAM CLI.

   ```bash
   sam deploy --guided
   ```

   Follow the prompts to configure your deployment settings.

## Usage

### Start with a JSON Object

Define a JSON object representing your data model. For instance, a blog post entity might look like this:

```json
{
  "slug": "your-article-slug",
  "title": "Your Article Title",
  "date": "YYYY-MM-DD",
  "categories": ["category1"],
  "tags": ["tag1", "tag2"],
  "socialPosts": [
    {
      "type": "Social Media Platform",
      "message": "Your social media message",
      "scheduledDate": "YYYY-MM-DDTHH:MM:SS"
    }
  ]
}
```

### Generating an API Spec

1. **Create or Copy Your JSON Object**: Prepare the JSON object representing the data you want to transform into an API.

2. **Deploy the Spec Generation Stack**: Deploy the generator using the SAM CLI, as described above.

3. **Run the Generator**: Use the deployed API to generate your API spec.

4. **View and Use the Generated Spec**: Access the generated API spec and use it as a foundation for your application development.

**Example Request Body**

```json
{
  "resourceName": "content",
  "example": {
    "title": "hello",
    "services": ["Cache"],
    "socialPosts": [{"id": "asdf", "type": "twitter", "message": "test"}],
    "copies": [{"id": "fff", "type": "Draft"}]
  }
}
```

### Integration with Postman

1. **Fork the Public Postman Collection**: Access and fork the public Postman collection from [Allen Helton's Public Workspace](https://www.postman.com/allenheltondev/workspace/allen-helton-s-public-workspace).

2. **Run the Collection**: Execute the collection to create a mock server based on your API spec, enabling immediate frontend development.

## Additional Notes

- This tool is a proof of concept designed to demonstrate the feasibility of AI-assisted API development.
- The project is open for further enhancements and contributions.

## Support

For support and contributions, please refer to the [GitHub repository](https://github.com/allenheltondev/api-spec-quickstart) or contact the maintainer.

---

Happy coding and enjoy the accelerated development process! 🚀👨‍💻👩‍💻
