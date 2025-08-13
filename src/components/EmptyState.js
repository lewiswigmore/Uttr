import React from 'react';
import { Text, Button, makeStyles, tokens } from '@fluentui/react-components';
import { DocumentRegular, AddRegular } from '@fluentui/react-icons';
import { loadDemoData } from '../utils/demoData';

const useStyles = makeStyles({
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 32px',
    textAlign: 'center',
    minHeight: '300px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    '@media (max-width: 768px)': {
      padding: '48px 24px',
      minHeight: '250px',
    },
    '@media (max-width: 480px)': {
      padding: '32px 16px',
      minHeight: '200px',
    },
  },
  emptyIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '24px',
    '@media (max-width: 768px)': {
      fontSize: '40px',
      marginBottom: '16px',
    },
    '@media (max-width: 480px)': {
      fontSize: '32px',
      marginBottom: '12px',
    },
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
    lineHeight: tokens.lineHeightBase500,
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeBase400,
    },
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase300,
    },
  },
  emptyDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '32px',
    maxWidth: '400px',
    lineHeight: tokens.lineHeightBase400,
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeBase200,
      marginBottom: '24px',
      maxWidth: '350px',
    },
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase200,
      marginBottom: '16px',
      maxWidth: '280px',
    },
  },
  createButton: {
    marginTop: '16px',
    padding: '16px 24px',
    '@media (max-width: 768px)': {
      marginTop: '12px',
      padding: '12px 20px',
    },
    '@media (max-width: 480px)': {
      marginTop: '8px',
      width: '100%',
      maxWidth: '200px',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      width: '100%',
      maxWidth: '250px',
      gap: '8px',
    },
  }
});

const EmptyState = ({ type = 'notes', onCreateNote }) => {
  const styles = useStyles();

  const getEmptyStateContent = () => {
    switch (type) {
      case 'search':
        return {
          title: 'No notes found',
          description: 'Try adjusting your search terms or filters. You can search by title, content, or tags.',
          showButton: false
        };
      case 'notes':
      default:
        return {
          title: 'No notes yet',
          description: 'Start capturing your thoughts, ideas, and important information. Your first note is just a click away!',
          showButton: true
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className={styles.emptyContainer}>
      <DocumentRegular className={styles.emptyIcon} />
      <Text className={styles.emptyTitle}>
        {content.title}
      </Text>
      <Text className={styles.emptyDescription}>
        {content.description}
      </Text>
      {content.showButton && onCreateNote && (
        <>
          <Button
            className={styles.createButton}
            appearance="primary"
            icon={<AddRegular />}
            onClick={onCreateNote}
            size="large"
          >
            Create Your First Note
          </Button>
          <Button
            className={styles.createButton}
            onClick={() => loadDemoData()}
            size="large"
          >
            Load Demo Workspace
          </Button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
