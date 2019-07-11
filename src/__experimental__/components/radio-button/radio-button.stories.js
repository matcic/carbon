import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  boolean, text, number, select
} from '@storybook/addon-knobs';
import OptionsHelper from '../../../utils/helpers/options-helper';
import { RadioButton, RadioButtonGroup } from '.';
// import { info, notes } from './documentation';

storiesOf('Experimental/RadioButton', module)
  .add('default', () => {
    return (
      <RadioButtonGroup groupName='example'>
        <RadioButton
          id={ text('radioOneId', 'input-1') }
          label={ text('radioOneLabel', 'Example Radio Button 1') }
          value={ text('radioOneValue', 'test-1') }
          { ...defaultKnobs() }
        />
        <RadioButton
          id={ text('radioTwoId', 'input-2') }
          label={ text('radioTwoLabel', 'Example Radio Button 2') }
          value={ text('radioTwoValue', 'test-2') }
          { ...defaultKnobs() }
        />
        <RadioButton
          id={ text('radioThreeId', 'input-3') }
          label={ text('radioThreeLabel', 'Example Radio Button 3') }
          value={ text('radioThreeValue', 'test-3') }
          { ...defaultKnobs() }
        />
      </RadioButtonGroup>
    );
  }, {
    info: {
      // text: info,
      excludedPropTypes: ['children']
    }// ,
    // notes: { markdown: notes }
  });

function defaultKnobs() {
  return ({
    disabled: boolean('disabled', false),
    error: boolean('error', false),
    fieldHelp: text('fieldHelp', 'This text provides help for the input.'),
    fieldHelpInline: boolean('fieldHelpInline', false),
    reverse: boolean('reverse', false),
    labelHelp: text('labelHelp', 'This text provides more information for the label.'),
    inputWidth: number('inputWidth', 0, {
      range: true,
      min: 0,
      max: 100,
      step: 1
    }),
    labelWidth: number('labelWidth', 0, {
      range: true,
      min: 0,
      max: 100,
      step: 1
    }),
    labelAlign: select(
      'labelAlign',
      OptionsHelper.alignBinary,
      OptionsHelper.alignBinary[0]
    ),
    size: select('size', OptionsHelper.sizesBinary, 'small')
  });
}
