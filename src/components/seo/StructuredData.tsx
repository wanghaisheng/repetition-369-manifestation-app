
import { Helmet } from 'react-helmet-async';

interface WebApplicationSchema {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    contactType: string;
    email: string;
  };
}

interface StructuredDataProps {
  type: 'WebApplication' | 'Organization' | 'Article';
  data: WebApplicationSchema | OrganizationSchema | any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    if (type === 'WebApplication') {
      return {
        ...baseSchema,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1000'
        }
      };
    }

    if (type === 'Organization') {
      return {
        ...baseSchema,
        '@type': 'Organization',
        sameAs: [
          'https://twitter.com/xianghua369',
          'https://weibo.com/xianghua369'
        ]
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
};

// 预定义的结构化数据
export const WebAppStructuredData = () => (
  <StructuredData
    type="WebApplication"
    data={{
      name: '显化369',
      description: '一款极简优雅的显化练习应用，通过369方法帮助您实现愿望',
      url: 'https://xianghua369.com',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Any'
    }}
  />
);

export const OrganizationStructuredData = () => (
  <StructuredData
    type="Organization"
    data={{
      name: '显化369团队',
      url: 'https://xianghua369.com',
      logo: 'https://xianghua369.com/logo.png',
      description: '专注于显化练习和个人成长的团队',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@xianghua369.com'
      }
    }}
  />
);
