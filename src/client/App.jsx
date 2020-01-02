'use strict';

// Import NPM modules
import React, { Fragment, useState, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

// Load antDesign modules
import {
  Spin,
  Layout,
  Breadcrumb,
  Tag,
  Divider,
  Input,
  Button,
  Empty,
  message
} from 'antd';
const { Content, Footer } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

// Set the top height to 5
export const configureMessages = () =>
  message.config({
    top: 5
  });

// Set the height of the messages
export const resetMessageConfig = () => {
  // Close all other ones
  message.destroy();
  // Configure a new instance
  configureMessages();
};

// Where the breadcrumb is built
export const BreadcrumbContainer = memo(() => {
  return (
    <Breadcrumb
      style={{
        margin: '16px 0'
      }}>
      <BreadcrumbItem id="level-1">Home</BreadcrumbItem>
      <BreadcrumbItem id="level-2">Palindrome Finder</BreadcrumbItem>
    </Breadcrumb>
  );
});

// Title of the page
export const Title = memo(() => (
  <h3
    style={{
      textAlign: 'left'
    }}>
    Please enter a string and click the button below:
  </h3>
));

// Controls which allows you to change the current palindrome
export const PageControls = memo(({ value, onChange, onSubmit, onRefresh }) => (
  <span style={{ display: 'flex' }}>
    <Input
      data-testid="input-enter-palindrome"
      value={value}
      onChange={e => onChange(e.target.value || '')}
      onPressEnter={onSubmit}
    />
    <Button
      data-testid="button-submit-palindrome"
      type="primary"
      onClick={onSubmit}
      style={{ marginLeft: '16px' }}>
      Test Palindrome
    </Button>
    <Button
      data-testid="button-refresh-palindrome-list"
      type="default"
      onClick={onRefresh}
      style={{ marginLeft: '16px' }}>
      Refresh List
    </Button>
  </span>
));

PageControls.propTypes = {
  value: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

// Main area of the page
export const BodyArea = memo(({ palindromeList }) => (
  <Fragment>
    {palindromeList.length ? (
      palindromeList.map((number, index) => (
        <Tag style={{ marginBottom: '8px' }} key={index}>
          {number}
        </Tag>
      ))
    ) : (
      <Empty
        style={{ marginTop: '128px' }}
        description="No palindromes to display!"
      />
    )}
  </Fragment>
));

BodyArea.propTypes = {
  palindromeList: PropTypes.array
};

// Footer of the page
export const FooterArea = memo(() => (
  <Footer
    style={{
      textAlign: 'center'
    }}>
    NOTE: Any request sent to the backend will be proxied to an{' '}
    <a href="https://expressjs.com/" rel="noopener noreferrer" target="_blank">
      Express
    </a>{' '}
    server running on{' '}
    <a
      href="http://localhost:3000/palindromes"
      rel="noopener noreferrer"
      target="_blank">
      localhost:3000
    </a>{' '}
    via{' '}
    <a
      href="https://webpack.js.org/configuration/dev-server/"
      rel="noopener noreferrer"
      target="_blank">
      Webpack Dev Server
    </a>
    .
  </Footer>
));

// Export the main app
export default memo(() => {
  // Store selected palindrome and the overall list
  // Could have used useReducer here too...
  const [loading, updateLoading] = useState(false);
  const [palindrome, updatePalindrome] = useState('');
  const [palindromeList, updatePalindromeList] = useState([]);

  // HOOK: Save the reference for the refresh handler
  const handleOnRefresh = useCallback(() => {
    updateLoading(true);
    return fetch('api/palindromes')
      .then(result => result.json())
      .then(res => {
        updatePalindromeList(res.result);
        updateLoading(false);
      });
  }, []);

  // HOOK: Save the reference for the on submit handler
  const handleOnSubmit = useCallback(() => {
    const scopedPalindrome = palindrome;
    if (scopedPalindrome.length) {
      updateLoading(true);
      return fetch('api/palindromes', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: scopedPalindrome })
      })
        .then(result => result.json())
        .then(res => {
          // Clear any messages which are on the screen
          resetMessageConfig();
          if (res.result) {
            // Show a notification
            message.success(
              `'${scopedPalindrome}' is a valid palindrome!`,
              1.5
            );
            // Refresh the list, skip changing loading for now as we are making another API call
            handleOnRefresh();
          } else {
            message.error(
              `'${scopedPalindrome}' is NOT a valid palindrome!`,
              1.5
            );
            // Lets just set loading to false and not fetch a list which hasnt changed
            updateLoading(false);
          }
        });
    }
    return message.warning(
      'Please enter some text in the field below before continuing...',
      1.5
    );
  }, [handleOnRefresh, palindrome]);

  // HOOK: Get the initial list of palindromes (only runs on initial render)
  useEffect(() => {
    handleOnRefresh();
  }, [handleOnRefresh]);

  // // Configure the message object
  useEffect(() => {
    configureMessages();
  }, []);

  // Return JSX
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div>
          <BreadcrumbContainer />
        </div>
        <div
          style={{
            background: '#fff',
            padding: 0,
            paddingBottom: 24,
            minHeight: 280
          }}>
          <Spin spinning={loading}>
            <div
              style={{
                background: '#fff',
                padding: 24,
                minHeight: 'calc(100vh - 146px)'
              }}>
              <span>
                <Title />
                <PageControls
                  value={palindrome}
                  onChange={updatePalindrome}
                  onSubmit={handleOnSubmit}
                  onRefresh={handleOnRefresh}
                />
              </span>
              <Divider />
              <BodyArea palindromeList={palindromeList} />
            </div>
          </Spin>
        </div>
      </Content>
      <FooterArea />
    </Layout>
  );
});
