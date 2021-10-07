import React from "react";
import PropTypes from "prop-types";
import {
  ConfigurableItems,
  ConfigurableItemRow,
} from "../../../components/configurable-items";
import tagComponent from "../../../__internal__/utils/helpers/tags/tags";

class ConfigurableItemsContent extends React.Component {
  onChange = (rowId) => {
    return () => {
      this.props.onChange(rowId);
    };
  };

  rows = (itemsData) => {
    return itemsData.map((item, rowIndex) => {
      return (
        <ConfigurableItemRow
          enabled={item.get("enabled")}
          key={rowIndex}
          locked={item.get("locked")}
          name={item.get("name")}
          rowIndex={rowIndex}
          onChange={this.onChange(rowIndex)}
        />
      );
    });
  };

  render() {
    const { itemsData, ...configurableItemsProps } = this.props;
    return (
      <ConfigurableItems
        {...configurableItemsProps}
        {...tagComponent("configurable-items-content", this.props)}
      >
        {this.rows(itemsData)}
      </ConfigurableItems>
    );
  }
}

ConfigurableItemsContent.propTypes = {
  /**
   * The configurable item data.
   *
   * @property itemsData
   * @type {Object}
   */
  itemsData: PropTypes.object,

  /**
   * Callback triggered when the form is canceled.
   *
   * @property onCancel
   * @type {Function}
   */
  onCancel: PropTypes.func.isRequired,

  /**
   * Callback triggered when the checkbox checked value is updated.
   *
   * @property onChange
   * @type {Function}
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Callback triggered when an item is dragged.
   *
   * @property onDrag
   * @type {Function}
   */
  onDrag: PropTypes.func.isRequired,

  /**
   * Callback triggered when when the reset button is pressed.
   *
   * @property onReset
   * @type {Function}
   */
  onReset: PropTypes.func,

  /**
   * Callback triggered when the form is saved.
   *
   * @property onSave
   * @type {Function}
   */
  onSave: PropTypes.func.isRequired,
};

export default ConfigurableItemsContent;
