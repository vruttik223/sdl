'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Row, Col } from 'reactstrap';
import { RiHospitalLine, RiTimeLine } from 'react-icons/ri';
import { BiClinic } from "react-icons/bi";
import WrapperComponent from '../common/WrapperComponent';
import CommonSearchBar from '../common/CommonSearchBar';
import CustomDropdown from '../common/CustomDropdown';
import ClinicList from './ClinicList';
import Pagination from '@/components/common/Pagination';
import { useClinics } from '@/utils/hooks/useClinics';
import { fetchClinicSuggestions } from '@/api/clinics.api';
import Loader from '@/layout/loader';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
  { label: 'A to Z', value: 'name-asc' },
  { label: 'Z to A', value: 'name-desc' },
];

const ClinicFinderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get query parameters
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const specializationsParam = searchParams.get('specializations') || '';
  const sortByParam = searchParams.get('sortBy') || 'date-desc';
  
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState(
    specializationsParam ? specializationsParam.split(',').filter(Boolean) : []
  );
  const [sortBy, setSortBy] = useState(sortByParam);

  // Map sort value to API parameters
  const getSortParams = (sortValue) => {
    const [field, order] = sortValue.split('-');
    return {
      field: field === 'date' ? 'created_at' : 'name',
      sortBy: order, // 'asc' or 'desc'
    };
  };

  const sortParams = getSortParams(sortBy);

  // Fetch clinics data with query parameters
  const { data: response, isLoading, isError } = useClinics({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    search: searchQuery,
    specialization: selectedSpecializations.join(','),
    sortBy: sortParams.sortBy,
    field: sortParams.field,
  });

  const clinicsData = response?.data?.clinics || [];
  const specializations = response?.data?.specializations || [];
  const pagination = response?.data?.pagination || {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  };

  // Initialize clinic ID from URL
  useEffect(() => {
    const clinicId = searchParams.get('clinicId');
    if (clinicId) {
      setSelectedClinicId(clinicId);
    }
  }, [searchParams]);

  // Handle search - update URL which will trigger refetch
  const handleSearch = useCallback((query) => {
    const params = new URLSearchParams();
    params.set('page', '1'); // Reset to page 1 on new search
    
    if (query.trim()) {
      params.set('search', query.trim());
    }
    
    if (selectedSpecializations.length > 0) {
      params.set('specializations', selectedSpecializations.join(','));
    }

    router.push(`?${params.toString()}`);
  }, [router, selectedSpecializations]);

  // Handle search results from CommonSearchBar
  const handleSearchResults = useCallback(
    (query, results) => {
      handleSearch(query);
    },
    [handleSearch]
  );

  // Transform clinic API results for CommonSearchBar
  const transformClinic = useCallback((clinic) => {
    const locationParts = [
      clinic.city,
      clinic.state,
      clinic.pincode,
    ].filter(Boolean);
    
    // Extract specializations from doctorClinicSpecializations
    const specializations = clinic.doctorClinicSpecializations
      ?.map(dcs => dcs.doctorSpecialization?.name)
      .filter(Boolean)
      .join(', ') || '';

    return {
      id: clinic.uid,
      title: clinic.name,
      subtitle: locationParts.join(', '),
      slug: clinic.slug,
      searchableFields: ['title', 'subtitle'],
    };
  }, []);

  // Custom render for clinic search results
  const renderClinicResult = useCallback((item, index) => {
    if (item.isRecent) {
      return (
        <>
          <RiTimeLine className="recent-icon" aria-hidden="true" />
          <span className="suggestion-text">{item.title}</span>
        </>
      );
    }

    return (
      <>
        <div className="suggestion-icon">
          <BiClinic aria-hidden="true" />
        </div>
        <div className="suggestion-content">
          <span className="suggestion-text">
            {item.highlightMatches?.title ? (
              <span dangerouslySetInnerHTML={{ __html: highlightText(item.title, item.highlightMatches.title) }} />
            ) : (
              item.title
            )}
          </span>
          <span className="suggestion-meta">
            {item.subtitle}
          </span>
        </div>
      </>
    );
  }, []);

  // Helper function to highlight matched text
  const highlightText = (text, indices) => {
    if (!indices || !indices.length) return text;

    let result = '';
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<span class="search-highlight">${text.slice(start, end + 1)}</span>`;
      lastIndex = end + 1;
    });

    result += text.slice(lastIndex);
    return result;
  };

  // Handle specialization filter toggle
  const toggleSpecialization = useCallback((spec) => {
    const newSpecializations = selectedSpecializations.includes(spec)
      ? selectedSpecializations.filter(s => s !== spec)
      : [...selectedSpecializations, spec];

    setSelectedSpecializations(newSpecializations);

    const params = new URLSearchParams();
    params.set('page', '1'); // Reset to page 1 on filter change
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (newSpecializations.length > 0) {
      params.set('specializations', newSpecializations.join(','));
    }

    router.push(`?${params.toString()}`);
  }, [router, searchQuery, selectedSpecializations]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedSpecializations([]);
    setSelectedClinicId(null);
    router.push('/clinics/find');
  }, [router]);

  // Handle clinic selection
  const handleClinicClick = useCallback((clinic) => {
    const newClinicId = selectedClinicId === clinic.uid ? null : clinic.uid;
    setSelectedClinicId(newClinicId);

    const params = new URLSearchParams(searchParams.toString());
    
    if (newClinicId) {
      params.set('clinicId', newClinicId);
    } else {
      params.delete('clinicId');
    }

    router.push(`?${params.toString()}`);
  }, [selectedClinicId, searchParams, router]);

  // Handle sort change
  const handleSortChange = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
      const params = new URLSearchParams(searchParams.toString());
      params.set('sortBy', newSortBy);
      params.set('page', '1'); // Reset to page 1 on sort change
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hasActiveFilters = selectedSpecializations.length > 0 || searchQuery;

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <WrapperComponent classes={{ sectionClass: 'clinic-finder-section section-b-space' }}>
        <div className="clinic-finder-container">
          <h1 className="clinic-finder-title">Find Vaidyas Nearby</h1>
          <div className="error-message">
            <p>Failed to load clinics. Please try again later.</p>
          </div>
        </div>
      </WrapperComponent>
    );
  }

  return (
    <>
      <WrapperComponent
        classes={{ sectionClass: 'clinic-finder-section section-b-space' }}
      >
        <div className="clinic-finder-container">
          {/* <h1 className="clinic-finder-title">Find Vaidyas Nearby</h1> */}
          <div className="clinic-finder-header">
            <h1 className="clinic-finder-title">Find Vaidyas Nearby</h1>
            <p className="clinic-finder-subtitle">
              Search and find our clinics near you. Browse by location,
              specialization, and doctor. Get contact information and directions
              to our healthcare centers.
            </p>
          </div>

          {/* Search Bar and Sort Filter */}
          <div className="clinic-finder-search">
            <Row className="g-3">
              <Col lg={9} md={8}>
                <CommonSearchBar
                  storageKey="recent_clinic_searches"
                  placeholderWords={[
                    'Specialization',
                    'Clinic Name',
                    'City',
                    'Pincode',
                    'Doctor Name',
                  ]}
                  searchLabel="Search Clinics"
                  enableFuzzyMatch={true}
                  autoSearch={false}
                  fetchResults={fetchClinicSuggestions}
                  transformResults={transformClinic}
                  renderResultItem={renderClinicResult}
                  onSearch={handleSearchResults}
                  initialValue={searchQuery}
                  className="clinic-search-container"
                />
              </Col>
              <Col lg={3} md={4}>
                <CustomDropdown
                  label=""
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onChange={handleSortChange}
                />
              </Col>
            </Row>
          </div>

          {/* Specialization Filters */}
          <div className="clinic-filters-section">
            <div className="filters-header">
              <h3 className="filters-title">Filter by Specialization</h3>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
              )}
            </div>
            <div className="specialization-filters">
              <div className="specialization-scroll-container">
                {specializations.map((spec) => (
                  <button
                    key={spec.uid}
                    className={`specialization-filter-btn ${
                      selectedSpecializations.includes(spec.name)
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => toggleSpecialization(spec.name)}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="clinic-results-info">
            <p className="results-count">
              Showing {clinicsData.length} of {pagination.total} clinic
              {pagination.total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Clinic Cards Grid */}
          <div className="clinic-grid">
            <ClinicList
              clinics={clinicsData}
              selectedClinicId={selectedClinicId}
              onClinicClick={handleClinicClick}
              isLoading={isLoading}
            />
          </div>

          {/* Pagination */}
          {pagination.total > ITEMS_PER_PAGE && (
            <div className="clinic-pagination custome-pagination">
              <Pagination total={pagination.total} perPage={ITEMS_PER_PAGE} />
            </div>
          )}
        </div>
      </WrapperComponent>
    </>
  );
};

export default ClinicFinderPage;
