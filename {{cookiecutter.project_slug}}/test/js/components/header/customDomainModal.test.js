import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { addUrlParams } from 'utils/api';

import CustomDomainModal from 'components/header/customDomainModal';

describe('<CustomDomainModal />', () => {
  const toggleModal = jest.fn();

  const setup = () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <CustomDomainModal isOpen={true} toggleModal={toggleModal} />,
    );
    return { getByLabelText, getByText, getByTestId };
  };

  test('updates label when input changes', () => {
    const { getByLabelText, getByText, getByTestId } = setup();
    const input = getByLabelText('Custom Domain');

    expect(input).toBeVisible();
    expect(getByTestId('custom-domain')).toHaveTextContent('domain');

    fireEvent.change(input, { target: { value: ' ' } });

    expect(getByTestId('custom-domain')).toHaveTextContent('domain');

    fireEvent.change(input, { target: { value: ' foobar' } });

    expect(getByText('https://foobar.my.salesforce.com')).toBeVisible();
  });

  test('updates window.location.href on submit', () => {
    const { getByLabelText, getByText } = setup();

    jest.spyOn(window.location, 'assign');
    const input = getByLabelText('Custom Domain');
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.click(getByText('Continue'));

    expect(window.location.assign).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'foobar' } });
    fireEvent.click(getByText('Continue'));
    const baseUrl = window.api_urls.salesforce_custom_login();
    const expected = addUrlParams(baseUrl, {
      custom_domain: 'foobar',
      next: window.location.pathname,
    });

    expect(window.location.assign).toHaveBeenCalledWith(expected);
  });

  describe('cancel', () => {
    test('closes modal', () => {
      const { getByText } = setup();
      fireEvent.click(getByText('Cancel'));

      expect(toggleModal).toHaveBeenCalledWith(false);
    });
  });
});