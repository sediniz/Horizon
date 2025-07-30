import React from 'react';
import PackageCard from './PackageCard';
import EmptyState from './EmptyState';
import type { PackageProps } from '../types';

interface PackageListProps {
  packages: PackageProps[];
  onClearFilters: () => void;
}

const PackageList: React.FC<PackageListProps> = ({ packages, onClearFilters }) => {
  if (packages.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackageList;
