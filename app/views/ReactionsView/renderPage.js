import React from 'react';
import {
	View, Text, ScrollView
} from 'react-native';
import PropTypes from 'prop-types';

import { themes } from '../../constants/colors';
import styles from './styles';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import Avatar from '../../containers/Avatar';

const UserItem = React.memo(({
	username, name, theme
}) => (
	<View style={styles.userRow}>
		<Avatar
			text={username}
			size={50}
			borderRadius={6}
			theme={theme}
		/>
		<Text style={[styles.textBold, styles.userTitle, { color: themes[theme].bodyText }]}>{name}</Text>
	</View>
));

const TabPage = React.memo(({ reaction, theme }) => {
	const names = reaction.names || reaction.usernames;
	return (
		<ScrollView
			contentContainerStyle={styles.containerScrollView}
			testID='reaction-view-list'
			{...scrollPersistTaps}
		>
			{
				names.map((name, index) => <UserItem username={reaction.usernames[index]} name={name} theme={theme} />)
			}
		</ScrollView>
	);
});

UserItem.propTypes = {
	username: PropTypes.string,
	name: PropTypes.string,
	theme: PropTypes.string
};

TabPage.propTypes = {
	reaction: PropTypes.object,
	theme: PropTypes.string
};

export default TabPage;
