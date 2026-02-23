import React from 'react';
import PageContainer from '../components/PageContainer';
import Section from '../components/Section';
import ChartPanel from '../components/ChartPanel';

const About = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <PageContainer
      title="About"
      description="Project context and methodology for the stroke awareness analytics dashboard."
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Section title="Overview">
        <ChartPanel fullWidth>
          <div style={{ width: '100%' }}>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              This comprehensive analytics dashboard provides insights into stroke awareness
              patterns across different demographics, lifestyle factors, and community
              knowledge. The application helps identify awareness gaps and informs
              public health education strategies.
            </p>
          </div>
        </ChartPanel>
      </Section>

      <Section title="Project overview">
        <ChartPanel fullWidth>
          <div style={{ width: '100%', lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 16px 0" }}>
              <strong>Objective:</strong> Analyze stroke awareness patterns and identify
              key gaps in community knowledge.
            </p>
            <p style={{ margin: "0 0 16px 0" }}>
              <strong>Technology Stack:</strong> React, Recharts, React Router,
              with a focus on responsive design and data visualization.
            </p>
            <p style={{ margin: "0 0 16px 0" }}>
              <strong>Data Sources:</strong> Pre-computed JSON analytics files
              generated from survey responses.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Key Features:</strong> Interactive charts, demographic analysis,
              risk factor assessment, and community insights.
            </p>
          </div>
        </ChartPanel>
      </Section>

      <Section title="Development">
        <ChartPanel fullWidth>
          <div style={{ width: '100%', lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 16px 0" }}>
              <strong>Frontend Development:</strong> React components with Recharts
              visualization library.
            </p>
            <p style={{ margin: "0 0 16px 0" }}>
              <strong>Data Analytics:</strong> Python-based data processing
              and JSON generation pipeline.
            </p>
            <p style={{ margin: 0 }}>
              <strong>UI/UX Design:</strong> Professional healthcare dashboard
              with consistent color system and responsive layouts.
            </p>
          </div>
        </ChartPanel>
      </Section>
    </PageContainer>
  );
};

export default About;
