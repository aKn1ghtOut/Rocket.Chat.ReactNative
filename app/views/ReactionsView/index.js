import React, { useEffect } from 'react';
import {
	View, Text, TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import I18n from '../../i18n';
import { withTheme } from '../../theme';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import sharedStyles from './styles';
import SafeAreaView from '../../containers/SafeAreaView';
import Emoji from '../../containers/message/Emoji';

import TabPage from './renderPage';

const scrollProps = {
	keyboardShouldPersistTaps: 'always',
	keyboardDismissMode: 'none'
};

const RenderLabel = React.memo(({
	name, baseUrl, getCustomEmoji, reactions, page, theme
}) => (
	<View style={sharedStyles.tabView}>
		<Emoji
			content={name}
			standardEmojiStyle={sharedStyles.reactionEmoji}
			customEmojiStyle={sharedStyles.reactionCustomEmoji}
			baseUrl={baseUrl}
			getCustomEmoji={getCustomEmoji}
		/>
		<Text style={[sharedStyles.textBold, { color: themes[theme].bodyText }]}>{reactions[page].usernames.length}</Text>
	</View>
));

const renderTab = (getCustomEmoji, baseUrl, reactions, theme) => (
	name, page, isTabActive, onPressHandler, onLayoutHandler
) => (
	<TouchableOpacity
		activeOpacity={0.7}
		testID={`reaction-picker-${ name }`}
		key={`${ name }_${ page }`}
		onPress={() => onPressHandler(page)}
		onLayout={onLayoutHandler}
		underlayColor={themes[theme].tintActive}
	>
		<RenderLabel getCustomEmoji={getCustomEmoji} reactions={reactions} baseUrl={baseUrl} name={name} page={page} theme={theme} />
	</TouchableOpacity>
);

const ReactionsView = React.memo(({
	navigation, theme, route, baseUrl, customEmojis
}) => {
	const reactions = route.params?.reactions || [];

	const getCustomEmoji = (name) => {
		const emoji = customEmojis[name];
		if (emoji) {
			return emoji;
		}
		return null;
	};

	useEffect(() => {
		navigation.setOptions({ title: I18n.t('Reactions') });
	}, []);

	return (
		<View style={[sharedStyles.container, { backgroundColor: themes[theme].backgroundColor }]}>
			<SafeAreaView testID='profile-view'>
				<ScrollableTabView
					renderTabBar={() => <ScrollableTabBar underlineStyle={{ backgroundColor: themes[theme].auxiliaryTintColor }} style={[sharedStyles.tabsContainer, { backgroundColor: themes[theme].headerBackground }]} tabsContainerStyle={sharedStyles.tabsContainer} renderTab={renderTab(getCustomEmoji, baseUrl, reactions, theme)} />}
					contentProps={scrollProps}
					style={{ backgroundColor: themes[theme].backgroundColor }}
				>
					{
						reactions.map(reaction => <TabPage reaction={reaction} tabLabel={reaction.emoji} key={reaction.emoji} theme={theme} />)
					}
				</ScrollableTabView>
			</SafeAreaView>
		</View>
	);
});

RenderLabel.propTypes = {
	reactions: PropTypes.object,
	baseUrl: PropTypes.string,
	getCustomEmoji: PropTypes.func,
	name: PropTypes.string,
	page: PropTypes.number,
	theme: PropTypes.string
};

ReactionsView.propTypes = {
	navigation: PropTypes.object,
	theme: PropTypes.string,
	baseUrl: PropTypes.string,
	customEmojis: PropTypes.object,
	route: PropTypes.object
};

const mapStateToProps = state => ({
	baseUrl: state.server.server,
	customEmojis: state.customEmojis
});

export default connect(mapStateToProps)(withTheme(withDimensions(withSafeAreaInsets(ReactionsView))));
