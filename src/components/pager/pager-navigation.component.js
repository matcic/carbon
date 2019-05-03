import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import I18n from 'i18n-js';
import {
  PagerNavigationStyles,
  PagerNoSelectStyles,
  PagerButtonWrapperStyles
} from './pager.styles';
import Icon from '../icon';
import NumberComponent from '../number';
import Events from '../../utils/helpers/events';

const PagerNavigation = (props) => {
  const updatePageFromInput = (ev) => {
    let newPage = Math.abs(Number(ev.target.value));

    if (Number.isNaN(newPage)) { newPage = '1'; }
    if (!newPage) {
      props.setCurrentPage(this.props.currentPage);
    }
    if (newPage > maxPages()) { newPage = String(maxPages()); }

    props.onPagination(String(newPage), this.props.pageSize, 'input');
  };

  function maxPages() {
    const totalRecordsCount = props.totalRecords >= 0 ? props.totalRecords : 0;

    if (props.pageSize && props.pageSize !== '0' && totalRecordsCount > 0) {
      return Math.ceil(totalRecordsCount / props.pageSize);
    }
    return 1;
  }

  function navArrowChange(step) {
    const newPage = String(Number(props.currentPage) + step);
    const desc = step === 1 ? 'next' : 'previous';
    props.onPagination(newPage, props.pageSize, desc);
  }

  function navArrow(step) {
    const arrowProps = {
      'data-element': 'next-page',
      type: 'dropdown'
    };
    const totalRecordsCount = props.totalRecords >= 0 ? props.totalRecords : 0;
    const disabled = props.currentPage * props.pageSize >= totalRecordsCount;

    return (
      <PagerButtonWrapperStyles disabled={ disabled } next={ step === 1 }>
        <Icon
          onClick={ () => { navArrowChange(step); } }
          { ...arrowProps }
        />
      </PagerButtonWrapperStyles>
    );
  }

  function navLink(type) {
    return type;
  }

  function currentPageInput() {
    const currentPageInputProps = {
      value: props.currentPage,
      className: 'carbon-pager__current-page',
      'data-element': 'current-page',
      onChange: (ev) => {
        props.setCurrentPage(ev.target.value);
      },
      onBlur: updatePageFromInput,
      onKeyUp: (ev) => {
        if (Events.isEnterKey(ev)) {
          updatePageFromInput(ev);
        }
      }
    };

    return <NumberComponent { ...currentPageInputProps } />;
  }

  if (props.theme.name === 'classic') {
    return (
      <PagerNavigationStyles>
        { navArrow(-1) }
        <PagerNoSelectStyles>
          { I18n.t('pager.page_x', { defaultValue: 'Page ' }) }
        </PagerNoSelectStyles>
        { currentPageInput() }
        <PagerNoSelectStyles>
          { I18n.t('pager.of_y', { defaultValue: ' of ' }) }{ maxPages() }
        </PagerNoSelectStyles>
        { navArrow(1) }
      </PagerNavigationStyles>
    );
  }
  return (
    <PagerNavigationStyles>
      { navLink('first') }
      { navLink('back') }
      <PagerNoSelectStyles>
        { I18n.t('pager.page_x', { defaultValue: 'Page ' }) }
      </PagerNoSelectStyles>
      { currentPageInput() }
      <PagerNoSelectStyles>
        { I18n.t('pager.of_y', { defaultValue: ' of ' }) }{ maxPages() }
      </PagerNoSelectStyles>
      { navLink('next') }
      { navLink('last') }
    </PagerNavigationStyles>
  );
};

PagerNavigation.propTypes = {
  /** Current visible page */
  currentPage: PropTypes.string.isRequired,
  /** Total number of records */
  totalRecords: PropTypes.number.isRequired,
  /** Pagination page size */
  pageSize: PropTypes.string,
  /** Function called when pager changes (PageSize, Current Page) */
  onPagination: PropTypes.func.isRequired,
  /** Sets the current page being shown */
  setCurrentPage: PropTypes.func,
  /** Current theme */
  theme: PropTypes.object
};

export default withTheme(PagerNavigation);
