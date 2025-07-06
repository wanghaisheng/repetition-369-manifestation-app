
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface MicrosoftClarityProps {
  projectId: string;
}

export const MicrosoftClarity = ({ projectId }: MicrosoftClarityProps) => {
  useEffect(() => {
    // Only load if projectId is provided and not placeholder
    if (!projectId || projectId.includes('XXXXXXXXXX')) {
      console.log('Microsoft Clarity: Invalid or placeholder project ID');
      return;
    }

    // Load Microsoft Clarity
    (function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
  }, [projectId]);

  // Don't render anything if no valid project ID
  if (!projectId || projectId.includes('XXXXXXXXXX')) {
    return null;
  }

  return (
    <Helmet>
      <script>
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `}
      </script>
    </Helmet>
  );
};
