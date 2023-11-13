const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const pluralize = require('pluralize');

const bedrock = new BedrockRuntimeClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { resourceName, example } = body;

    const endpoints = getEndpoints('', resourceName, example);
    const spec = await generateSpec(example, endpoints);
    if (spec) {
      return {
        statusCode: 201,
        body: JSON.stringify({ spec })
      };
    } else {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'The generated specification was in an invalid format. Please try again.' })
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    };
  }
}

const generateSpec = async (resource, endpoints) => {
  const prompt = `Human: You are a senior level programmer who focuses on API spec-driven development. I need you to create an Open API Spec v3.0
    for this list of endpoints and resource. This needs to be complete with request and response schema definitions and success and error responses. For list endpoints, create a summary version of the schema. Use standard REST best practices in your
    design. Pull all reused parameters into the components/parameters section of the spec. Write the spec in JSON enclosed in a markdown code block.
    Endpoints:
    ${endpoints.map(e => {
    return `\t- ${e.path} (${e.methods.join(', ')})`
  }).join('\r\n')}
    Example Resource:
    ${JSON.stringify(resource, null, 2)}
     Assistant: `;

  const response = await bedrock.send(new InvokeModelCommand({
    modelId: 'anthropic.claude-instant-v1',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt,
      temperature: 1,
      max_tokens_to_sample: 5000,
      anthropic_version: "bedrock-2023-05-31"
    })
  }));

  const answer = JSON.parse(new TextDecoder().decode(response.body));
  const completion = answer.completion;
console.log(completion);
  const match = completion.match(/```(?:\S*\s)?([\s\S]*?)```/);
  const spec = match ? JSON.parse(match[1].trim()) : null;

  return spec;
};


const getEndpoints = (parent, resourceName, resource) => {
  let endpoints = buildEndpointsForResource(parent, resourceName);
  const parentPath = endpoints[endpoints.length - 1].path;

  const childResources = getChildResources(resource);
  for (const childResource of childResources) {
    const childEndpoints = getEndpoints(parentPath, childResource.name, childResource.example);
    endpoints = [...endpoints, ...childEndpoints];
  }

  return endpoints;
};

const camelToKebab = (camelCase) => {
  return camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const getChildResources = (resource) => {
  const childResources = [];
  for (const [key, entry] of Object.entries(resource)) {
    if (Array.isArray(entry) && entry.length) {
      const child = entry[0];
      if (typeof child == 'object' && !Array.isArray(child)) {
        childResources.push({ name: key, example: entry });
      }
    }
  }

  return childResources;
};

const buildEndpointsForResource = (parent, resourceName) => {
  const singularName = pluralize.singular(resourceName).replace(/ /g, '-').toLowerCase();
  const pluralName = camelToKebab(pluralize.plural(resourceName).replace(/ /g, '-')).toLowerCase();
  const endpoints = [
    {
      path: `${parent}/${pluralName}`,
      methods: ['post', 'get']
    },
    {
      path: `${parent}/${pluralName}/{${singularName}Id}`,
      methods: ['get', 'put', 'delete']
    }
  ];

  return endpoints;
};
