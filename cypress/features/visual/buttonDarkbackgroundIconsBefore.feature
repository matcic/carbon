Feature: Button component - dark background type with icons before
  I want to check that all examples of Button component - dark background type with icons before render correctly per theme

  @positive
  @applitools
  Scenario Outline: Check that dark background buttons with icons before render correctly with theme set to <theme>
    When I open "button" component dark_background_buttons_icons_before story with theme "<theme>"
    Then Element displays correctly
    Examples:
      | theme  |
      | mint   |
      | aegean |
      | none   |