import WrapperComponent from '@/components/common/WrapperComponent';
import TabNavigation from './components/TabNavigation';

export default function ResourcesLayout({ children }) {
  return (
    <>
      <WrapperComponent
        classes={{
          sectionClass: 'pt-0',
        }}
      >
        <TabNavigation />
        <div>{children}</div>
      </WrapperComponent>
    </>
  );
}
