'use strict';

// Import NPM modules
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getByTestId } from '@testing-library/dom';

// Add JS-DOM and some few nifty assertions to JEST
import '@testing-library/jest-dom/extend-expect';

// Import app
import App, {
  configureMessages,
  resetMessageConfig,
  BreadcrumbContainer,
  Title,
  PageControls,
  BodyArea,
  FooterArea
} from './App';

// NOTE: We wont be doing too much simulation of click events while its very
// much possible to do. Lets leave that for more full spectrum integration
// testing.

/* eslint-disable-next-line */
// NOTE: Known issue (02/01/2020): https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
const originalError = console.error;

// Test suite
describe('web application', () => {
  describe('functions', () => {
    describe('configureMessages()', () => {
      test('should not throw an error', () => {
        expect(configureMessages).not.toThrow();
      });
    });
    describe('resetMessageConfig()', () => {
      test('should not throw an error', () => {
        expect(resetMessageConfig).not.toThrow();
      });
    });
  });
  describe('react', () => {
    describe('<App/>', () => {
      beforeAll(() => {
        console.error = (...args) => {
          if (/Warning.*not wrapped in act/.test(args[0])) {
            return;
          }
          originalError.call(console, ...args);
        };
      });
      beforeEach(() => {
        // Reset the mocks
        fetch.resetMocks();
        // The next request will return the following data
        fetch.mockResponseOnce(
          JSON.stringify({ httpStatusCode: 200, result: ['aaa'] })
        );
      });
      test('renders without crashing', () => {
        const { container } = render(<App />);
        expect(container).toMatchSnapshot();
      });
      afterAll(() => {
        console.error = originalError;
      });
    });
    describe('<BreadcrumbContainer/>', () => {
      test('renders without crashing', () => {
        const { container } = render(<BreadcrumbContainer />);
        expect(container).toMatchSnapshot();
      });
    });
    describe('<Title/>', () => {
      test('renders without crashing', () => {
        const { container } = render(<Title />);
        expect(container).toMatchSnapshot();
      });
    });
    // NOTE: Due to writing this in a functional and modular way most of the interaction
    // apart from actual API calls done in this function we can test it independently
    // and pass any mocks / values down to the component
    describe('<PageControls/>', () => {
      const getDefaultProps = (propsToSpread = () => ({})) => ({
        value: '',
        onChange: () => void 0,
        onSubmit: () => void 0,
        onRefresh: () => void 0,
        ...propsToSpread
      });
      test('renders without crashing, input is empty', () => {
        const props = getDefaultProps({ value: '' });
        const { container } = render(<PageControls {...props} />);
        expect(container).toMatchSnapshot();
      });
      test('renders without crashing, input is NOT empty', () => {
        const props = getDefaultProps({ value: 'abcde fghij' });
        const { container } = render(<PageControls {...props} />);
        expect(container).toMatchSnapshot();
      });
      describe('event handlers', () => {
        // Store this ref to use later
        let container;
        // Build jest mocks
        const onChange = jest.fn(x => x);
        const onSubmit = jest.fn(x => x);
        const onRefresh = jest.fn(x => x);

        beforeEach(() => {
          // Render react component
          const props = getDefaultProps({ onChange, onSubmit, onRefresh });
          container = render(<PageControls {...props} />).container;
        });

        test('onChange() is called one with the correct value', () => {
          const testEnterPalindrome = getByTestId(
            container,
            'input-enter-palindrome'
          );
          fireEvent.change(testEnterPalindrome, {
            target: { value: 'abcdefg' }
          });
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.results[0].value).toBe('abcdefg');
        });

        test('onSubmit() is called when button is clicked', () => {
          const testPalindromeButton = getByTestId(
            container,
            'button-submit-palindrome'
          );
          fireEvent.click(testPalindromeButton);
          expect(onSubmit.mock.calls.length).toBe(1);
        });

        test('onRefresh() is called when button is clicked', () => {
          const testRefreshPalidromeList = getByTestId(
            container,
            'button-refresh-palindrome-list'
          );
          fireEvent.click(testRefreshPalidromeList);
          expect(onRefresh.mock.calls.length).toBe(1);
        });
      });
    });
    describe('<BodyArea/>', () => {
      test('renders with an empty list of palindromes', () => {
        const { container } = render(<BodyArea palindromeList={[]} />);
        expect(container).toMatchSnapshot();
      });
      test('renders with an non-empty list of palindromes', () => {
        const { container } = render(<BodyArea palindromeList={['otto']} />);
        expect(container).toMatchSnapshot();
      });
    });
    describe('<FooterArea/>', () => {
      test('renders without crashing', () => {
        const { container } = render(<FooterArea />);
        expect(container).toMatchSnapshot();
      });
    });
  });
});
