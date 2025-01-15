import { StackScreenProps } from '@react-navigation/stack'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import HistoryListItem from '../components/History/HistoryListItem'
import { getGenericRecordsByQuery } from '../components/History/HistoryManager'
import { CustomRecord, RecordType } from '../components/History/types'
import ScanButton from '../components/common/ScanButton'
import { useConfiguration } from '../contexts/configuration'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { HomeStackParams, Screens } from '../types/navigators'

import ListCredentials from './ListCredentials'

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
const offset = 25
type HomeProps = StackScreenProps<HomeStackParams, Screens.Home>

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { useCustomNotifications } = useConfiguration()
  const { notifications } = useCustomNotifications()
  const { t } = useTranslation()
  const { HomeTheme } = useTheme()
  const [store] = useStore()
  const [historyItems, setHistoryItems] = useState<CustomRecord[]>()
  const { credentialListOptions: CredentialListOptions } = useConfiguration()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingHorizontal: offset,
    },
    messageContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      height: 250,
      width: 300,
    },
    header: {
      marginTop: offset,
      marginBottom: 20,
    },
    linkContainer: {
      minHeight: HomeTheme.link.fontSize,
      marginTop: 10,
    },
    link: {
      ...HomeTheme.link,
    },
    fabContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    homeImage: {
      height: '85%',
      width: '80%',
    },
    cardView: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20, width: wp('100%') },
    cardContentView: {
      backgroundColor: ColorPallet.brand.primary,
      width: wp('45%'),
      height: 80,
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      alignContent: 'center',
    },
    countCardText: {
      ...HomeTheme.notificationsHeader,
      color: '#fff',
    },
    cardText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '900',
      fontStyle: 'normal',
    },
    viewText: {
      ...HomeTheme.notificationsHeader,
      fontSize: 14,
      fontWeight: '500',
      fontStyle: 'normal',
      alignSelf: 'flex-end',
      marginRight: 20,
    },
    historyText: {
      ...HomeTheme.welcomeHeader,
      fontSize: 16,
      fontWeight: 'bold',
      fontStyle: 'normal',
      marginLeft: 20,
    },
    cardBottomBorder: {
      borderBottomWidth: 0.5,
      borderBottomColor: '#A0A4AB',
      marginTop: 10,
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    title: {
      marginTop: 16,
    },
    credentialsCardList: { flexGrow: 0, marginLeft: 15 },
    renderView: {
      marginRight: 15,
      marginTop: 15,
      width: wp('85%'),
    },
    favContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 170,
      marginLeft: 10,
    },
  })

  const renderEmptyListComponent = () => {
    return (
      <View style={{ alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <Text style={[styles.title, TextTheme.normal]}>{t('ActivityHistory.NoHistory')}</Text>
      </View>
    )
  }

  const renderHistoryListItem = (item: CustomRecord) => {
    return <HistoryListItem item={item} />
  }
  const renderHistoryView = () => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 0, paddingHorizontal: 20 }}
          data={historyItems}
          ListEmptyComponent={renderEmptyListComponent}
          renderItem={element => renderHistoryListItem(element.item)}
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <CredentialListOptions />
      <View style={styles.cardView}>
        <TouchableOpacity
          style={styles.cardContentView}
          onPress={() => {
            navigation.navigate(Stacks.ContactStack, { screen: Screens.Contacts, params: { navigation: navigation } })
          }}>
          <Text style={styles.countCardText}>{`${connectionCount}`}</Text>
          <Text style={styles.cardText}>{t('Home.ConnectionsCount')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardContentView}
          onPress={() => {
            navigation.navigate(TabStacks.CredentialStack, { screen: Screens.Credentials })
          }}>
          <Text style={styles.countCardText}>{`${credentialCount}`}</Text>
          <Text style={styles.cardText}>{t('Home.CredentialsCount')}</Text>
        </TouchableOpacity>
      </View>

      {/* {credentialList && credentialList?.length >0 && */}
      <View style={styles.headerView}>
        <Text style={styles.historyText}>{t('Global.Credentials')}</Text>

        {credentialList && credentialList?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(TabStacks.CredentialStack, { screen: Screens.Credentials })
            }}>
            <Text style={styles.viewText}>{t('Home.ViewAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.favContainer}>
        <ListCredentials isHorizontal />
      </View>

      <View>
        <View style={styles.headerView}>
          <Text style={styles.historyText}>{t('Global.History')}</Text>
          {historyItems && historyItems.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Stacks.HistoryStack, { screen: Screens.HistoryPage })
              }}>
              <Text style={styles.viewText}>{t('Home.ViewAll')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView>
        {historyItems && historyItems.length > 0 && store.preferences.useHistoryCapability ? (
          renderHistoryView()
        ) : (
          <View style={styles.messageContainer}>
            <Image source={require('../assets/img/homeimage.png')} resizeMode="contain" style={styles.homeImage} />
          </View>
        )}
      />
      <View style={styles.messageContainer}>
        <Image source={require('../assets/img/homeimage.png')} resizeMode="contain" style={styles.homeImage} />
      </View>
      <View style={styles.fabContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default Home