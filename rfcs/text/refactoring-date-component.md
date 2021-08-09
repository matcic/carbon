- Start Date: (2021-07-28)

# Table of contents

- [Summary](#summary)
- [Basic example](#basic-example)
- [Motivation](#motivation)
- [Detailed design](#detailed-design)
  - [Replacing Momentjs](#replacing-momentjs)
  - [Continuing to use React DayPicker](#continuing-to-use-react-daypicker)
  - [Locales](#locales)
  - [Event handling](#event-handling)
  - [Support for hidden input](#support-for-hidden-input)
  - [DatePicker component](#datepicker-component)
- [Drawbacks](#drawbacks)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How we teach this](#how-we-teach-this)
- [Unresolved questions](#unresolved-questions)

# Summary

The purpose of this document is to outline a new simplified `Date` component implementation, removing any technical debt or logic that is specifically tied to any consuming project whilst supporting consumers in being able to implement their requirements in their own codebases.

# Basic example

The new implementation will be written as a functional component and only support being used as a controlled input: it will require the implementing developer to provide `value` and `onChange` props. The `onBlur` prop will also be required so the component can handle reformatting the value string based on the locale supplied via an `I18nProvider`. This will allow implementation teams to implement the component as follows:

```jsx
  // my-component.component.js
  const MyComponent = () => {
    const [value, setValue] = useState("28/07/1987");

    const updateDateValue = (ev) => {
      const { formattedValue } = ev.target.value;
      setVisibleValue(formattedValue);
    };

    return (
      <I18nProvider>
        <Date
          value={value}
          onChange={updateValue}
          onBlur={updateValue}
        />
      </I18nProvider>
    );
  };
```

The remaining props intended for the input will be opt-in or have a default value. The component will also continue to support the styling props (such as `size` and spacing props) that the existing one does. Furthermore, it will continue to support the same validation interface to ensure that it can still be integrated with `formik` or whatever form library implementation teams choose to use.

```js
  inputProps = {
    onFocus,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    size = "medium",
    labelHelp,
    labelAlign,
    labelInline,
    labelSpacing,
    labelWidth,
    inputWidth,
    fieldHelp,
    error,
    warning,
    info,
    placeholder,
    required,
    allowEmptyValue = false,
    ...marginSpacingProps,
  }
```

# Motivation

The current component within `carbon-react` has a significant amount of technical debt and has a lot of logic specific to a project that was previously its main consumer. For example, the component supports being used as both as a controlled and uncontrolled component which again adds to the complexity. The current implementation is also tied to using `moment` to manage the parsing and formatting of date values. However, the maintainers of the [project](https://momentjs.com/docs/#/-project-status/) have previously labelled it as a legacy project and as such will no longer be releasing new features and it will only be maintained up to the point of addressing critical security concerns. Whilst this is not necessarily something that will have a significant impact on all our consumers, we should look to implement a `Date` component that does not rely on a legacy solution as there are several lightweight alternatives. Carbon currently exports an extensive set of [date utils](https://github.com/Sage/carbon/blob/master/src/utils/helpers/date/date.js) all of which use `moment` and support a large amount of date formats for all locales which adds to the complexity of the component.  

As the number of consumers of the library has grown this has led to a lot of [issues](https://github.com/Sage/carbon/issues?q=is%3Aissue+is%3Aopen+date) being raised against the component. Some of the code was written over four years ago, and the addition of some newer features during this time have led to the code for the component being significantly bloated and therefore difficult to maintain.

# Detailed design

The date passed to the picker component can be updated through a `useEffect` hook that checks the current value in the input is both a valid format (based on the value recieved from the locale context) and parses to a valid Date. As such the component will be able to maintain a significantly reduced amount of internal state for the `selectedDate` and the `open` state for the picker component.

```jsx
  // src/components/date/date.component.js
  import {
    formatToString,
    isValidFormat,
    parseToDate,
    isValidDate,
    formatISOString
  } from "./__internal__/date-utils"

  const DateInput = ({ value, onChange, onBlur, onFocus, inputProps, ...rest }) => {
    const locale = useContext(LocaleContext);
    const { date } = locale;
    const format = date.formats.javascript();
    const formats = date.formats.input();
    const [selectedDate, setSelectedDate] = useState(parseToDate(value, formats.javascript()));
    const [open, setOpen] = useState(false));

    useEffect(() => {
      // if value string is valid format and parses to valid date setSelectedDate to parsed value
    }, [value]);

    return (
      <div {...rest}>
        <Textbox
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          inputIcon="calendar"
          iconOnClick={handleIconClick}
          onClick={handleOnClickHandler}
          {...inputProps}
        />
        <DatePicker
          inputValue={value}
          selectedDate={selectedDate}
          isOpen={open}
          onDayClick={handleDayClick}
        />
      </div>
    );
  };

  DateInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    ...inputProps
  };
```

## Replacing Momentjs

As mentioned previously the `moment` project has been marked as legacy. The maintainers have documented several alternatives of which `date-fns` seems best suited for our implementation needs. It is fast, lightweight and modular, allowing us to only import the functions we need rather than the whole package of functions. It uses the existing native JavaScript date API and the functions it provides for parsing and formatting dates are immutable and pure: returning new instances rather than modifying existing parsed dates (limiting any bugs that could arise). The adoption of `date-fns` is widespread, many component libraries either use it directly or provide an abstraction with it as the default option. We will deprecate the utils that we currently export for date formatting and parsing at the same time as rewriting the component after ensuring an appropriate warning has been added in advance. Removing the utils will help streamline the codebase and ensure that Carbon is closer aligned to UI component library.

## Continuing to use React DayPicker

Research into whether we should migrate to a new solution or continue to use `react-day-picker` revealed that the library is still widely adopted and actively maintained when [comparing](https://react.libhunt.com/react-day-picker-alternatives) it to alternatives. Furthermore, `react-day-picker` has moved away from using `moment` in `v7` in favour of `date-fns` which would mean there will be consistency between the library Carbon uses and the one the calendar picker uses. Therefore, it is reasonable to continue to continue to use this library and look to update it to the at least `v7` at the same time as rewriting the date component.

## Locales

The locale specific date formats will be supplied via the `I18nProvider` component, which allows implementation teams to either use the default locale object or override it with their own. The locale object must match the interface detailed in the [i18n RFC](https://github.com/Sage/carbon/blob/master/rfcs/text/i18n.md) documenting the approach. Following this pattern will allow implementation teams to define the valid formats they want to allow for the input and what they want it to be reformatted to when the input is blurred. Separating valid formats by locale will lessen the amount of maintenance the component will require.

One option for implementing translations within this component is to leverage the locales already provided by [date-fns/locale](https://github.com/date-fns/date-fns/tree/master/src/locale), whereby the locale string can be used to map to the relevant file. The [localize](https://date-fns.org/v2.23.0/docs/I18n-Contribution-Guide#localize) properties surfaced from `date-fns` support translations for weekdays, months and so on  out of the box. Whilst this would couple our implementation closely to `date-fns` if we decided later we needed to move away from it implementing a different mechanism would not be too complex.

An alternative option is to support translations via additional properties passed in with the `locale` from the `I18nProvider`. There is still some work to be carried out by the Design System team so the approach taken will be based on the decisions they make but for the purpose of this document we have adopted the first approach.

## Event handling

The event emitted `onBlur` and `onChange` should meet the specification defined in the [onChange interface RFC](https://github.com/Sage/carbon/blob/master/rfcs/text/onChange.md) and that is also found in the current component. This will mean implementation teams will have access to both a `formattedValue` and `rawValue`: if the `event.type` is blur the `formattedValue` should be set to the reformatted value based on the selected date of the `DatePicker` which will be stored in state. If the `event.type` is anything else the `formattedValue` should be the `event.target.value`.

```js
  const buildEventObject = (event) => {
    const { id, name } = event.target;

    event.target = {
      ...(name && { name }),
      ...(id && { id }),
      value: {
        formattedValue: event.type === "blur" ? formattedValue(selectedDate) : event.target.value,
        rawValue: formatISO(selectedDay)
      },
    };

    return event;
  };
```

The `handleDayClick` callback which is used by `react-day-picker` to update the `selectedDate` should also create the same custom event object and trigger the `onChange` handler to update the input value. The event type is `click` so we will need to ensure we provide the value for `event.target.value`. 

```jsx
  const handleDayClick = (date, { disabled }, event) => {
    if (disabled) {
      return;
    }

    setSelectedDate(date);
    onChange(buildEventObject({...event, target: {...event.target, value: formatToString(date, format)}}));
  };
```

## Support for hidden input

Whilst we will continue to support the same custom event object, we will remove the `hidden` input that the current component renders. It is unlikely that many of our consumers will require it so it is acceptable to push the requirement to implement one onto those that do. This will mean we no longer have to maintain any state relating to either the `formattedValue` or `rawValue` as is done in the current component. Below is an example of how a hidden input can be implemented with the proposed new component:

```jsx
  // my-component-with-hidden-input.component.js
  const MyComponent = () => {
    const [value, setValue] = useState("28/07/1987");
    const [hiddenValue, setHiddenValue] = useState("1987-07-28");

    const updateDateValues = (event) => {
      const { formattedValue, rawValue } = event.target.value;
      setVisibleValue(formattedValue);
      setHiddenValue(rawValue)
    };

    return (
      <I18nProvider>
        <div>
          <Date
            value={value}
            onChange={updateValues}
            onBlur={updateValues}
            name="date-input"
          />
          <input
            type="hidden"
            name="date-input"
            data-element="hidden-input"
            value={hiddenValue}
          />
        </div>
      </I18nProvider>
    );
  };
```

## DatePicker component

We will continue to use the same sub-components such as `Navbar` and `Weekday`, although they should be moved to an `__internal__` directory as will the `DatePicker` component as they will never need to be directly imported by consuming projects. The `containerProps` prop provides an interface for implementing keyboard accessibility within the picker (`tabIndex`, `onKeyDown` and so on). The [locale interface](https://react-day-picker.js.org/docs/localization) surfaced by `react-day-picker` will be integrated with whatever implementation we decide best meets requirements to override with the correct translations strings. Below is an example of how translating weekdays can be achieved using the locales surfaced from `date-fns`.

```js
  const renderWeekdayElement = (weekdayElementProps) => {
    const { className, weekday } = weekdayElementProps;
    const weekdayLong = localize.day(weekday);     
    const weekdayShort = localize.day(weekday, { width: "abbreviated" });
    
    return (
      <Weekday className={className} title={weekdayLong}>
        <abbr title={weekdayLong}>{weekdayShort}</abbr>
      </Weekday>
    );
  }}
```

As with the existing component we will store a `lastValidValue` in internal state and use that to control the date displayed in the `DatePicker`. This can be achieved by leveraging a `useEffect` hook to update the state value if a new `inputValue` parses to a valid Date. We will also keep the same implementation the current component has with regards to rendering the `DatePicker` in a `portal` using the existing `Popover` component.

```jsx
  // date/__internal__/date-picker/date-picker.component.js
  import {
    localeMap,
    isValidDate,
    parseToDate
  } from "./__internal__/date-utils";

  const Picker = ({
    inputValue,
    selectedDate,
    onDayClick,
    isOpen,
    disablePortal
  }) => {
    const [lastValidValue, setLastValidValue] = useState(inputValue);
    const { locale, date } = useContext(LocaleContext);
    const { formats } = date;
    const { localize, options } = localeMap[locale()];
    const format = formats.javascript();
    const { weekStartsOn } = options;

    if (!isOpen) return null;

    useEffect(() => {
      // check if inputValue parses to valid date and update lastValidValue string if true
    }, [
      format,
      inputValue,
      lastValidValue,
    ]);

    return (
      <Popover
        ...
      >
      <StyledDayPicker>
        <DayPicker
          firstDayOfWeek={weekStartsOn}
          onDayClick={onDayClick}
          selectedDays={selectedDate}
          month={ parseToDate(lastValidValue, format) }
          weekdayElement={renderWeekdayElement}
          ...
        />
      </StyledDayPicker>
    </Popover>
    );
  };
```

# Drawbacks

Carrying out this proposal will mean introducing several breaking changes. Writing the new component as a functional component will mean that any consuming project that has extended the previous class-based component will now need to update to use composition instead. We will also be removing the utils we currently export and any new ones we write will be in an `__internal__` directory. By moving the `DatePicker`, `Weekday` and `Navbar` components to an `__internal__` directory we will also be making a breaking change, but this will be for the better in the long run as these components should not be directly imported by consuming projects and we can then make changes to their interfaces without needing to have them be breaking. The `Date` component is used extensively by our consumers so these breaking changes are likely to have widespread impact. Although it is certainly arguable that the current implementation has enough issues with it that this too is having significant impact.

The new proposed component will be tightly coupled to `date-fns` meaning if a better alternative becomes available, we will have a harder job migrating to it. However, writing our own internal utils that use the underlying `date-fns` interface should mitigate some of this work. Furthermore, if any issues arise with it we are reliant on support from the maintainers of `date-fns`, although it is widely adopted and maintained at present. The library uses different [Unicode patterns](https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md) for date formats so we will need to ensure these differences are communicated to implementation teams.

Currently `react-day-picker` does not support styled-components or any other CSS-in-JS so we will have to continue to apply the styles as is currently implemented in the existing component. This has the potential to lock us to a specific version or at the very least create potential pain points when we do upgrade. However, the classes we would be hooking into are part of the defined interface the package exposes to support customising styles and has not changed from the version we are currently using `v6.1.1` to the latest available one `v7.10.0` so we will likely have advanced warning of any changes to them.

# Alternatives

One alternative to carrying out the proposed in this document is that we do not do it at all. We continue to maintain the existing component as is, fix the bugs and look to introduce the feature requests raised. This is an option in the short-term, but the code is already bloated significantly and there are a number of regressions some of which have not been picked up by our cypress or chromatic tests. Therefore, it is likely that we will be revisiting the need to rewrite the component sooner rather than later.

Another option is that we refactor the existing component to simplify the code and fix the issues already raised. However, we would still need to introduce breaking changes as we plan to refactor all class-based input components to be functional anyway. As well as this, refactoring could likely prove more complex than rewriting the component: some of the legacy code outdates any of the current Carbon team and is tightly coupled with older projects.

In terms of alternate designs, we could look to alter the value emitted on event handling, other UI libraries emit a Date object for example. This was rejected as it would mean we would make migrating from the old implementation to the new component more difficult and may mean move away from what was defined in previous RFC documents. Currently our consuming projects expect to pass a string value and to receive one back, if we keep this pattern then we are not putting additional load on to them with respect to formatting the value from Date to string.

There are a number of date management solutions available as an alternative to `date-fns`: [Luxon](https://moment.github.io/luxon/); [Dayjs](https://day.js.org/); [js-Joda](https://js-joda.github.io/js-joda/); or using the Date object directly instead or a library. An additional alternative would be to integrate an abstraction for any of these potential solutions, for example [date-io](https://github.com/dmtrKovalenko/date-io) would support this. Of these options, `date-fns` is the most lightweight and will require the least integration into the new component. It is either the chosen or default option for many other UI libraries. For our requirements, it is unlikely we will need to surface an abstraction at this point as we will not be requiring implementation teams to do any configuration past what is defined in the interface and what they will need to pass in via the locale. If the need to introduce an abstraction arose it would not be too complex to refactor it to support this without introducing a breaking change.

Similarly there are a number of other options for integrating within the `DatePicker`, for example [react-datepicker](https://reactdatepicker.com/) and [react-flatpickr](https://github.com/haoxins/react-flatpickr). However, they all come with limitations: a lack of documentation, no support for CSS-in-JS and more configuration requirements with respect to locale support.

# Adoption strategy

As mentioned, this proposal will be implemented as a breaking change for the significant technical debt to be removed and to fix the existing bugs we have raised against the current implementation. In terms of how consuming projects will migrate to it, the majority of the interface should remain the same so the bulk of the work will be on adding the correct locale properties, so the desired formats are provided to the component.

If a project has extended the component, they will need to update their codebase to adopt composition instead: it may require additional support in this scenario to provide examples of how they can achieve the same functionality using this approach. If any of the utils have been imported and used directly, those projects that need to can include it in their own codebases.

# How we teach this

For consumers of the Carbon library there are RFCs for `onChange` and `I18nProvider` available that document some aspects of the approach proposed for the new component. The existing storybook demos and their code snippets will also be useful examples of implementing the new interface, as mentioned some additional ones demonstrating the locale support will also be worthwhile.

For Carbon developers the `date-fns` and `react-day-picker` documentation is very detailed and the adoption for both projects is widespread. By continuing to use `react-day-picker` we are limiting the amount of new technology introduced in this rewrite so for existing developers at least it should not be steep learning curve.

# Unresolved questions

There is an outsanding question about how to best implement the translations within the `DatePicker`. It is currently being discussed by the Design System team and once a decision has been made we can decide on which option best delivers the requirements.
