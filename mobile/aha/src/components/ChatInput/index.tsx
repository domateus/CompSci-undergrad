import {uuidv4} from '../../utils';
import {useState} from 'react';
import {FiSend} from 'react-icons/fi';
import {GrAttachment} from 'react-icons/gr';
import {launchImageLibrary} from 'react-native-image-picker';
import React from 'react';
import {observer} from 'mobx-react-lite';
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import contacts from '../../observable/contacts';
import session from '../../observable/session';
import {Tooltip} from '@rneui/themed';
import theme from '../../theme';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import OctiIcon from 'react-native-vector-icons/Octicons';
import {styles} from '../../utils/page-style';

const algorithms: EncryptionAlgorithm[] = [
  'Caesar cipher',
  'Monoalphabetic',
  'Polyalphabetic',
  'Hill cipher',
  'Playfair',
  'OTP',
  'Rail fence',
  'Columnar',
  'DES',
  'AES',
  'RC4',
  'RSA',
  'ECC',
];

type SendMessagePayload = {
  text: string;
  encryption: EncryptionAlgorithm;
  images: {id: string; src: string}[];
};

const ChatInput: React.FC<{
  sendMessage: (payload: SendMessagePayload) => void;
}> = observer(({sendMessage}) => {
  const [text, setText] = useState('');
  const [encryption, setEncryption] = useState<EncryptionAlgorithm>('OTP');
  const [tooltipKey, resetTooltip] = useState(uuidv4());
  const [images, setImages] = useState<{id: string; src: string}[]>([]);
  const [visible, setVisible] = useState(false);

  const sendIcon = (
    <IonicIcon name="send" size={18} color={theme.COLORS.WHITE} />
  );
  const attachIcon = (
    <IonicIcon name="attach" size={20} color={theme.COLORS.WHITE} />
  );
  const plusIcon = (
    <OctiIcon name="plus" size={20} color={theme.COLORS.WHITE} />
  );
  const handleEncryptionChange = (algorithm: EncryptionAlgorithm) => {
    setEncryption(algorithm);
  };

  const handleSubmitEditing = () => {
    sendMessage({text, encryption, images});
    setText('');
    setImages([]);
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      // console.log(response);
      if (response) {
        setImages(prev => [
          ...prev,
          {id: uuidv4(), src: `${response.assets[0].uri}`},
        ]);
      }
    });
  };

  return (
    <>
      <KeyboardAvoidingView style={S.InputContainer}>
        <TextInput
          style={S.Input}
          editable={
            !!contacts.list.find(c => c.name === session.userToChat)?.dhk
          }
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmitEditing}
        />
        <View style={styles.gap} />
        <View style={S.Buttons}>
          {sendIcon}
          <TouchableOpacity onPress={handleChoosePhoto}>
            {attachIcon}
          </TouchableOpacity>
          <Tooltip
            visible={visible}
            withOverlay={false}
            skipAndroidStatusBar
            onOpen={() => {
              setVisible(true);
            }}
            onClose={() => {
              setVisible(false);
            }}
            pointerColor={theme.COLORS.ORANGE_2}
            containerStyle={{
              backgroundColor: theme.COLORS.ORANGE_2,
              padding: 0,
              height: 300,
              position: 'absolute',
              top: Dimensions.get('window').height - 378,
            }}
            popover={
              <View>
                <FlatList
                  style={S.List}
                  data={algorithms.map(key => ({key}))}
                  renderItem={({item}) => (
                    <Text
                      onPress={() => {
                        handleEncryptionChange(item.key);
                        setVisible(false);
                      }}
                      style={{color: theme.COLORS.WHITE, fontWeight: 'bold'}}>
                      {item.key}
                    </Text>
                  )}
                />
              </View>
            }>
            {plusIcon}
          </Tooltip>
          {/*<GrAttachment color={images.length ? 'green' : 'black'} />*/}
          {/*<input*/}
          {/*  type="file"*/}
          {/*  id="image-input"*/}
          {/*  accept="image/jpeg, image/png, image/jpg"*/}
          {/*  onChange={e => {*/}
          {/*    if (!e.target.files?.length) return;*/}
          {/*    // const url = URL.createObjectURL(e.target.files![0]);*/}
          {/*    const reader = new FileReader();*/}
          {/*    reader.addEventListener('load', () => {*/}
          {/*      const url = reader.result;*/}
          {/*      setImages(prev => [...prev, {id: uuidv4(), src: `${url}`}]);*/}
          {/*    });*/}
          {/*    reader.readAsDataURL(e.target.files[0]);*/}
          {/*  }}*/}
          {/*/>*/}
          <TouchableOpacity
            onPress={() => {
              setText('');
              sendMessage({text, encryption, images});
              setImages([]);
            }}>
            {/*<FiSend color="black" />*/}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View>
        {!!images.length && <Text>Images: </Text>}
        {(images || []).map(image => (
          <Image height={100} width={100} source={{uri: image.src}} />
        ))}
      </View>
    </>
  );
});

export default ChatInput;

const S = StyleSheet.create({
  InputContainer: {
    justifyContent: 'flex-end',
    borderColor: 'transparent',
    borderTopColor: theme.COLORS.WHITE,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  Buttons: {
    padding: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  FileButton: {},
  EncryptionButton: {},
  SendButton: {},
  ListItem: {},
  List: {},
  Input: {
    padding: 4,
    height: 26,
    flex: 1,
    fontSize: theme.SIZE.SM,
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 10,
  },
});
