const axios = require('axios');

// Simulate a save request with some 'bad' data that should now be handled by our lenient Zod schema
async function testSave() {
  const versionId = 'cm9p07qiv0009m1kic6z0u59x'; // You'll need a real one or mock the session
  const data = {
    personalInfo: { name: 'Test User' },
    summary: 'A test summary',
    skills: { languages: ['JS'], frameworks: [], tools: [] },
    experience: [],
    projects: [
      {
        id: 'test-p-1',
        title: 'Project with nulls',
        description: null, // Should be allowed now
        techStack: null,   // Should be allowed now
        highlights: null,  // Should be allowed now
        included: true
      },
      {
        id: 'test-p-2',
        title: 'Minimal Project'
      }
    ],
    education: []
  };

  console.log('Sending test save request...');
  // Note: This won't work directly because of auth, but we can check the logic by running the route code via node
}

// Since I can't easily mock the Next.js Request/Response and Auth here, 
// I will instead write a unit test for the schema logic itself.

const { z } = require('zod');

const projectSchema = z.object({
  id: z.string(),
  title: z.string().default("Untitled Project"),
  description: z.string().nullish().default(""),
  techStack: z.array(z.string()).nullish().default([]),
  liveUrl: z.string().nullish(),
  githubUrl: z.string().nullish(),
  highlights: z.array(z.string()).nullish().default([]),
  aiGenerated: z.boolean().optional().default(false),
  included: z.boolean().optional().default(true),
});

const cvSchema = z.object({
  versionId: z.string(),
  data: z.object({
    personalInfo: z.any(),
    summary: z.string().default(""),
    skills: z.any(),
    experience: z.array(z.any()).default([]),
    projects: z.array(projectSchema).default([]),
    education: z.array(z.any()).default([]),
    atsScore: z.number().optional().default(0),
  }),
});

const testData = {
  versionId: 'test-v-1',
  data: {
    personalInfo: {},
    projects: [
      {
        id: 'p1',
        title: 'Test',
        description: null,
        techStack: null
      },
      {
        id: 'p2'
      }
    ]
  }
};

try {
  const parsed = cvSchema.parse(testData);
  console.log('Schema Validation SUCCESS');
  console.log('Parsed Project 1:', JSON.stringify(parsed.data.projects[0], null, 2));
  console.log('Parsed Project 2:', JSON.stringify(parsed.data.projects[1], null, 2));
} catch (e) {
  console.error('Schema Validation FAILED');
  console.error(JSON.stringify(e.errors, null, 2));
  process.exit(1);
}
