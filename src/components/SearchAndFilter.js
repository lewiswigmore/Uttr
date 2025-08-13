import React from 'react';
import {
  Input,
  Button,
  Badge,
  Dropdown,
  Option,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import {
  SearchRegular,
  FilterRegular,
  DismissRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    '@media (max-width: 768px)': {
      padding: '20px',
      marginBottom: '24px',
      gap: '12px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      marginBottom: '16px',
      gap: '8px',
    },
  },
  searchRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'stretch',
    },
    '@media (max-width: 480px)': {
      gap: '8px',
    },
  },
  searchInput: {
    flex: 1,
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
    },
  },
  sortDropdown: {
    minWidth: '160px',
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: '12px',
    '@media (max-width: 768px)': {
      gap: '8px',
      paddingTop: '16px',
    },
    '@media (max-width: 480px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '8px',
    },
  },
  filterLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase100,
      marginBottom: '4px',
    },
  },
  tagsRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    '@media (max-width: 480px)': {
      width: '100%',
      justifyContent: 'flex-start',
      gap: '8px',
    },
  },
  tagBadge: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '6px 12px',
    ':hover': {
      transform: 'scale(1.05)',
    },
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase100,
      padding: '4px 8px',
      ':hover': {
        transform: 'none',
      },
    },
  },
  activeBadge: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  moreBadge: {
    cursor: 'default',
    opacity: 0.7,
  },
  clearButton: {
    marginLeft: 'auto',
    flexShrink: 0,
    '@media (max-width: 480px)': {
      marginLeft: 0,
      alignSelf: 'flex-end',
      marginTop: '8px',
    },
  }
});

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  availableTags, 
  selectedTags, 
  onTagToggle, 
  onClearFilters,
  sortBy,
  onSortChange 
}) => {
  const styles = useStyles();
  const [showAllTags, setShowAllTags] = React.useState(false);

  const TAG_DISPLAY_LIMIT = 10;
  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, TAG_DISPLAY_LIMIT);
  const hiddenCount = availableTags.length - TAG_DISPLAY_LIMIT;

  const sortOptions = [
    { key: 'updated', text: 'Last Updated' },
    { key: 'updated-desc', text: 'Oldest Updated' },
    { key: 'created', text: 'Recently Created' },
    { key: 'created-desc', text: 'Oldest Created' },
    { key: 'title', text: 'Title A-Z' },
    { key: 'title-desc', text: 'Title Z-A' },
    { key: 'pinned', text: 'Pinned First' },
    { key: 'content-length', text: 'Longest Content' },
    { key: 'content-length-desc', text: 'Shortest Content' }
  ];

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchRow}>
        <Input
          className={styles.searchInput}
          placeholder="Search notes by title, content, or tags..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          contentBefore={<SearchRegular />}
          size="large"
        />
        <Dropdown
          className={styles.sortDropdown}
          placeholder="Sort by"
          value={sortOptions.find(option => option.key === sortBy)?.text || 'Last Updated'}
          onOptionSelect={(event, data) => {
            if (data.optionValue) {
              onSortChange(data.optionValue);
            }
          }}
        >
          {sortOptions.map(option => (
            <Option key={option.key} value={option.key}>
              {option.text}
            </Option>
          ))}
        </Dropdown>
      </div>

      {availableTags.length > 0 && (
        <div className={styles.filterRow}>
          <div className={styles.filterLabel}>
            <FilterRegular /> Filter by tags:
          </div>
          <div className={styles.tagsRow}>
            {visibleTags.map(tag => (
              <Badge
                key={tag}
                className={`${styles.tagBadge} ${selectedTags.includes(tag) ? styles.activeBadge : ''}`}
                appearance={selectedTags.includes(tag) ? 'filled' : 'tint'}
                onClick={() => onTagToggle(tag)}
                size="small"
              >
                #{tag}
              </Badge>
            ))}
            {hiddenCount > 0 && !showAllTags && (
              <Badge 
                className={`${styles.tagBadge} ${styles.moreBadge}`}
                appearance="outline" 
                size="small"
                onClick={() => setShowAllTags(true)}
                role="button"
              >
                +{hiddenCount} more
              </Badge>
            )}
            {showAllTags && availableTags.length > TAG_DISPLAY_LIMIT && (
              <Badge
                className={`${styles.tagBadge} ${styles.moreBadge}`}
                appearance="outline"
                size="small"
                onClick={() => setShowAllTags(false)}
                role="button"
              >
                Show less
              </Badge>
            )}
          </div>
          {(searchTerm || selectedTags.length > 0) && (
            <Button
              className={styles.clearButton}
              appearance="subtle"
              icon={<DismissRegular />}
              onClick={onClearFilters}
              size="small"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
