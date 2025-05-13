import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type CustomDropdownProps = {
  selected: string;
  setSelected: (value: string) => void;
  options: string[];
  placeholder?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  selected,
  setSelected,
  options,
  placeholder = '선택하세요',
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selected || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.dropdownContainer}>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.option,
                      index === options.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 40,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    maxHeight: 300,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});