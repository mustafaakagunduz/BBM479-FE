import * as React from "react";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        activeTab, 
        setActiveTab 
      });
    }
    return child;
  });
  
  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className, 
  activeTab, 
  setActiveTab 
}) => {
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        activeTab, 
        setActiveTab 
      });
    }
    return child;
  });
  
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-md ${className || ''}`}>
      {childrenWithProps}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children, 
  className,
  activeTab,
  setActiveTab
}) => {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium transition-all
        ${isActive 
          ? 'bg-white text-blue-600 shadow' 
          : 'text-gray-600 hover:text-gray-800'}
        ${className || ''}`}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children, 
  className,
  activeTab
}) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ${className || ''}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };