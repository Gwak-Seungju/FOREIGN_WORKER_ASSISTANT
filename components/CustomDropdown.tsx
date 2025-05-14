import { useState } from "react";
import { StyleProp, StyleSheet, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface CustomDropdownProps {
  items: { label: string; value: string }[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  dropDownStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showTickIcon?: boolean;
  boldSelected?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CustomDropdown({
  items,
  value,
  onChange,
  placeholder = "Select...",
  style,
  dropDownStyle,
  textStyle,
  showTickIcon = true,
  boldSelected = false,
  containerStyle,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
      <View style={[styles.dropdownWrapper, dropDownStyle]}>
        <DropDownPicker
          open={open}
          value={value}
          items={items.map((item) => ({
            ...item,
            labelStyle: {
              fontWeight: boldSelected && item.value === value ? 'bold' : 'normal',
            },
          }))}
          setOpen={setOpen}
          setValue={(callback) => {
            const selected = callback(value);
            onChange(selected);
          }}
          setItems={() => {}}
          placeholder={placeholder}
          showTickIcon={showTickIcon}
          style={[styles.dropdown, style]}
          dropDownContainerStyle={[styles.dropdownContainer, containerStyle]}
          textStyle={textStyle}
          zIndex={1000}
          dropDownDirection="AUTO"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    zIndex: 1000,
    width: 120,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: '#fff',
  }
});
