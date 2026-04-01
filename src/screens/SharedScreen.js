import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Switch,
  TextInput
} from 'react-native';
import { 
  Menu, 
  Search, 
  ChevronRight, 
  Users, 
  Megaphone, 
  Code, 
  Brush,
  MoreVertical,
  Share2,
  Copy,
  X,
  CheckCircle2,
  Plus,
  Trash2,
  Rocket,
  Palette,
  Clock,
  Inbox,
  Check,
  MessageSquare,
  ArrowRight
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SharedScreen = ({ navigation }) => {
  const { colors, typography, isDark } = useTheme();
  const { workspaces, addWorkspace } = useNotes();
  const [activeTab, setActiveTab] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const [invitations, setInvitations] = useState([
    {
      id: 'i1',
      sender: 'Sarah Miller',
      workspaceName: 'Marketing Q4',
      message: 'Join us to plan the next campaign!',
      avatar: '#ffcc00',
      time: '2h ago'
    },
    {
      id: 'i2',
      sender: 'Dev Somchai',
      workspaceName: 'Core Backend',
      message: 'Need your review on the API docs.',
      avatar: '#4cd964',
      time: '1d ago'
    }
  ]);

  // New Workspace Creation States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [selectedWsIcon, setSelectedWsIcon] = useState('rocket');
  const [selectedWsColor, setSelectedWsColor] = useState('#007AFF');

  const creationIcons = [
    { name: 'rocket', component: Rocket },
    { name: 'megaphone', component: Megaphone },
    { name: 'code', component: Code },
    { name: 'brush', component: Brush },
    { name: 'users', component: Users }
  ];

  const wsColors = ['#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30', '#1C1C1E'];

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const recentActivities = [
    { id: '1', user: 'Alex (You)', action: 'added a note to', workspace: 'Project Alpha', time: '12m ago', icon: 'file-text' },
    { id: '2', user: 'Somchai', action: 'joined', workspace: 'Core Backend', time: '1h ago', icon: 'user-plus' },
    { id: '3', user: 'Nui', action: 'updated', workspace: 'Marketing Q4', time: '3h ago', icon: 'refresh-cw' },
  ];

  const handleAcceptInvite = (id) => {
    setInvitations(invitations.filter(i => i.id !== id));
    triggerToast();
  };

  const handleDeclineInvite = (id) => {
    setInvitations(invitations.filter(i => i.id !== id));
  };


  const sharedNotes = [
    {
      id: 101,
      title: 'Project Alpha Brief',
      snippet: 'The goal of Project Alpha is to streamline our internal communication tools...',
      sharedWith: '4 people'
    }
  ];

  const handleCreateWorkspace = () => {
    if (!newWsName.trim()) return;
    addWorkspace({
      name: newWsName,
      iconName: selectedWsIcon,
      color: selectedWsColor,
    });
    setNewWsName('');
    setShowCreateModal(false);
    triggerToast();
  };

  const openWorkspaceMenu = (ws) => {
    setSelectedWorkspace(ws);
    setShowWorkspaceMenu(true);
  };

  const handleDeleteWorkspace = (id) => {
    setWorkspaces(workspaces.filter(ws => ws.id !== id));
    setShowWorkspaceMenu(false);
  };

  const toggleLinkSharing = () => {
    if (!selectedWorkspace) return;
    setWorkspaces(workspaces.map(ws => 
      ws.id === selectedWorkspace.id ? { ...ws, linkEnabled: !ws.linkEnabled } : ws
    ));
    setSelectedWorkspace({ ...selectedWorkspace, linkEnabled: !selectedWorkspace.linkEnabled });
  };

  const triggerToast = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setShowToast(false));
  };

  const getIcon = (name, color) => {
    const size = 20;
    switch(name) {
      case 'megaphone': return <Megaphone size={size} color={color} />;
      case 'code': return <Code size={size} color={color} />;
      case 'brush': return <Brush size={size} color={color} />;
      case 'rocket': return <Rocket size={size} color={color} />;
      case 'users': return <Users size={size} color={color} />;
      default: return <Users size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? colors.card : colors.white }]}>
        <TouchableOpacity onPress={() => setShowSidebar(true)}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shared</Text>
        <TouchableOpacity>
          <Search size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && [styles.tabActive, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>All Shared</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recent' && [styles.tabActive, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'invites' && [styles.tabActive, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveTab('invites')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.tabText, activeTab === 'invites' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>Invites</Text>
            {invitations.length > 0 && (
              <View style={[styles.badgeTiny, { backgroundColor: colors.danger, marginLeft: 6 }]}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>{invitations.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {activeTab === 'all' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Collaborative Spaces</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(true)}>
                <View style={[styles.shareIconButton, { backgroundColor: colors.primary }]}>
                  <Plus size={20} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>

            {workspaces.map(ws => (
              <TouchableOpacity 
                key={ws.id} 
                style={[styles.spaceCard, { backgroundColor: colors.card, borderColor: colors.border }]} 
                onPress={() => navigation.navigate('WorkspaceDetail', { workspace: ws })}
              >
                <View style={[styles.iconBox, { backgroundColor: ws.color + '15' }]}>
                  {getIcon(ws.iconName, ws.color)}
                  <View style={[styles.memberBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {ws.members.length > 1 ? (
                       <Text style={[styles.memberText, { color: colors.text }]}>+{ws.members.length - 1}</Text>
                    ) : (
                       <Users size={10} color={colors.text} />
                    )}
                  </View>
                </View>
                <View style={styles.spaceContent}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{ws.name}</Text>
                  <View style={styles.spaceMeta}>
                    <View style={[styles.roleBadge, { backgroundColor: ws.role === 'Owner' || ws.role === 'Admin' ? colors.primary : (isDark ? '#3A3A3C' : '#E9E9EB') }]}>
                      <Text style={[styles.roleText, { color: ws.role === 'Owner' || ws.role === 'Admin' ? colors.white : colors.primary }]}>{ws.role}</Text>
                    </View>
                    <Text style={styles.sep}>•</Text>
                    <Text style={[styles.activityText, { color: colors.textSecondary }]}>{ws.activity}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => openWorkspaceMenu(ws)}>
                  <MoreVertical size={20} color={colors.placeholder} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === 'recent' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 20 }]}>Recent Activity</Text>
            {recentActivities.map(activity => (
              <View key={activity.id} style={[styles.activityRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.activityIconBox, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                  <Clock size={16} color={colors.textSecondary} />
                </View>
                <View style={styles.activityTextContent}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>
                    <Text style={{ fontWeight: '700' }}>{activity.user}</Text> {activity.action} <Text style={{ fontWeight: '700', color: colors.primary }}>{activity.workspace}</Text>
                  </Text>
                  <Text style={{ color: colors.placeholder, fontSize: 12, marginTop: 4 }}>{activity.time}</Text>
                </View>
                <ArrowRight size={16} color={colors.placeholder} />
              </View>
            ))}
          </>
        )}

        {activeTab === 'invites' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 20 }]}>Pending Invitations</Text>
            {invitations.length === 0 ? (
               <View style={styles.emptyState}>
                 <Inbox size={48} color={colors.placeholder} opacity={0.5} />
                 <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 16 }}>No pending invites</Text>
                 <Text style={{ color: colors.placeholder, fontSize: 14, textAlign: 'center', marginTop: 4 }}>When someone invites you to a space, it will appear here.</Text>
               </View>
            ) : (
              invitations.map(invite => (
                <View key={invite.id} style={[styles.inviteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.inviteHeader}>
                    <View style={[styles.avatarCircleSmall, { backgroundColor: invite.avatar }]}>
                       <Text style={{ fontWeight: '800', color: '#FFF', fontSize: 12 }}>{invite.sender[0]}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.inviteSender, { color: colors.text }]}>{invite.sender}</Text>
                      <Text style={[styles.inviteWorkspace, { color: colors.primary }]}>{invite.workspaceName}</Text>
                    </View>
                    <Text style={{ color: colors.placeholder, fontSize: 12 }}>{invite.time}</Text>
                  </View>
                  <Text style={[styles.inviteMessage, { color: colors.textSecondary }]}>{invite.message}</Text>
                  <View style={styles.inviteActions}>
                    <TouchableOpacity style={[styles.inviteBtn, styles.declineBtn]} onPress={() => handleDeclineInvite(invite.id)}>
                      <X size={18} color={colors.danger} />
                      <Text style={{ color: colors.danger, fontWeight: '700', marginLeft: 6 }}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.inviteBtn, styles.acceptBtn, { backgroundColor: colors.primary }]} onPress={() => handleAcceptInvite(invite.id)}>
                      <Check size={18} color="#FFF" />
                      <Text style={{ color: '#FFF', fontWeight: '700', marginLeft: 6 }}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shared Notes</Text>
        </View>

        {sharedNotes.map(note => (
          <TouchableOpacity key={note.id} style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.noteHeader}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
              <TouchableOpacity onPress={() => setShowShareModal(true)}>
                <Share2 size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.noteSnippet, { color: colors.textSecondary }]} numberOfLines={2}>{note.snippet}</Text>
            <View style={styles.noteFooter}>
              <View style={styles.avatarGroup}>
                 <View style={[styles.avatar, { backgroundColor: '#FFD1D1' }]} />
                 <View style={[styles.avatar, { backgroundColor: '#D1E8FF', marginLeft: -8 }]} />
              </View>
              <Text style={[styles.sharedInfoText, { color: colors.textSecondary }]}>SHARED WITH {note.sharedWith.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create New Workspace Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowCreateModal(false)}>
            <View style={styles.sidebarBackdrop} />
          </TouchableWithoutFeedback>
          <View style={[styles.bottomSheetContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Workspace</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={[styles.iconButton, { backgroundColor: colors.lightGray }]}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.creationPreviewRow}>
               <View style={[styles.iconPreviewBox, { backgroundColor: selectedWsColor + '20' }]}>
                  {getIcon(selectedWsIcon, selectedWsColor)}
               </View>
               <TextInput 
                 style={[styles.createInput, { color: colors.text, borderBottomColor: colors.border }]}
                 placeholder="Workspace Name"
                 placeholderTextColor={colors.placeholder}
                 value={newWsName}
                 onChangeText={setNewWsName}
                 autoFocus
               />
            </View>

            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>SELECT ICON</Text>
            <View style={styles.iconSelectionGrid}>
               {creationIcons.map(item => (
                 <TouchableOpacity 
                   key={item.name}
                   style={[
                     styles.iconItemBlock, 
                     { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                     selectedWsIcon === item.name && { backgroundColor: selectedWsColor + '30', borderColor: selectedWsColor, borderWidth: 2 }
                   ]}
                   onPress={() => setSelectedWsIcon(item.name)}
                 >
                   <item.component size={24} color={selectedWsIcon === item.name ? selectedWsColor : colors.textSecondary} />
                 </TouchableOpacity>
               ))}
            </View>

            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>THEME COLOR</Text>
            <View style={styles.colorSelectionGrid}>
               {wsColors.map(color => (
                 <TouchableOpacity 
                    key={color}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      selectedWsColor === color && { borderWidth: 3, borderColor: colors.text, transform: [{ scale: 1.1 }] }
                    ]}
                    onPress={() => setSelectedWsColor(color)}
                 />
               ))}
            </View>

            <TouchableOpacity 
              style={[styles.confirmCreateButton, { backgroundColor: colors.primary }]} 
              onPress={handleCreateWorkspace}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18 }}>Create Workspace</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowShareModal(false)}>
            <View style={styles.sidebarBackdrop} />
          </TouchableWithoutFeedback>
          <View style={[styles.bottomSheetContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Share Workspace</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)} style={[styles.iconButton, { backgroundColor: colors.lightGray }]}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Collaborate with your team. Anyone with the link can join if enabled.</Text>
            
            <View style={[styles.shareToggleRow, { borderBottomColor: colors.border }]}>
               <View style={{ flex: 1 }}>
                 <Text style={[styles.toggleLabel, { color: colors.text }]}>Link Sharing</Text>
                 <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>{selectedWorkspace?.linkEnabled ? 'Anyone with link can join' : 'Only invited members'}</Text>
               </View>
               <Switch 
                 value={selectedWorkspace?.linkEnabled} 
                 onValueChange={toggleLinkSharing}
                 trackColor={{ false: '#767577', true: colors.primary }}
                 thumbColor={colors.white}
               />
            </View>

            {selectedWorkspace?.linkEnabled && (
              <View style={[styles.linkCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={[styles.linkText, { color: colors.primary }]} numberOfLines={1}>{selectedWorkspace?.shareLink}</Text>
                <TouchableOpacity style={[styles.copyButton, { backgroundColor: colors.primary }]} onPress={triggerToast}>
                  <Copy size={18} color={colors.white} />
                  <Text style={{ color: colors.white, fontWeight: '700', marginLeft: 8 }}>Copy</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.memberHeader}>
               <Text style={[styles.memberSectionTitle, { color: colors.text }]}>Members</Text>
               <View style={[styles.memberBadgeSmall, { backgroundColor: colors.primary }]}>
                 <Text style={{ color: colors.white, fontSize: 10, fontWeight: '800' }}>{selectedWorkspace?.members.length}</Text>
               </View>
            </View>

            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
              {selectedWorkspace?.members.map(member => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={[styles.avatarCircle, { backgroundColor: member.avatar }]}>
                    <Text style={{ fontWeight: '800', color: '#000' }}>{member.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberRoleLabel, { color: colors.textSecondary }]}>{member.role}</Text>
                  </View>
                  {selectedWorkspace.role === 'Owner' && member.role !== 'Admin' ? (
                    <TouchableOpacity style={styles.removeButton}>
                      <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 12 }}>REMOVE</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.roleTagText, { color: colors.placeholder }]}>{member.role === 'Admin' ? 'ADMIN' : ''}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={{ height: 40 }} />
          </View>
        </View>
      </Modal>

      {/* Workspace Menu Modal (Bottom Sheet Style) */}
      <Modal
        visible={showWorkspaceMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWorkspaceMenu(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowWorkspaceMenu(false)}>
            <View style={styles.sheetBackdrop} />
          </TouchableWithoutFeedback>
          <View style={[styles.actionSheet, { backgroundColor: colors.card }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.actionSheetTitle, { color: colors.textSecondary }]}>WORKSPACE OPTIONS</Text>
            
            <TouchableOpacity 
              style={[styles.actionItem, { borderBottomColor: colors.border }]} 
              onPress={() => { setShowWorkspaceMenu(false); setShowShareModal(true); }}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Share2 size={24} color={colors.primary} />
              </View>
              <View style={styles.actionTextContent}>
                <Text style={[styles.actionLabel, { color: colors.text }]}>Manage Sharing</Text>
                <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>Manage members and permissions</Text>
              </View>
              <ChevronRight size={20} color={colors.placeholder} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => handleDeleteWorkspace(selectedWorkspace?.id)}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.danger + '15' }]}>
                <Trash2 size={24} color={colors.danger} />
              </View>
              <View style={styles.actionTextContent}>
                <Text style={[styles.actionLabel, { color: colors.danger }]}>Delete Workspace</Text>
                <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>Remove this workspace permanently</Text>
              </View>
              <ChevronRight size={20} color={colors.placeholder} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]} 
              onPress={() => setShowWorkspaceMenu(false)}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </View>
        </View>
      </Modal>

      {/* Sidebar Modal */}
      <Modal
        visible={showSidebar}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowSidebar(false)}
      >
        <View style={styles.sidebarOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowSidebar(false)}>
            <View style={styles.sidebarBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.sidebarContainer}>
            <Sidebar 
              navigation={navigation} 
              onClose={() => setShowSidebar(false)} 
              currentRoute="Shared" 
            />
          </View>
        </View>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
          <CheckCircle2 size={20} color={colors.white} />
          <Text style={styles.toastText}>Link copied to clipboard!</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  tabActive: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  memberBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
  },
  memberText: {
    fontSize: 10,
    fontWeight: '700',
  },
  spaceContent: {
    flex: 1,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  spaceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sep: {
    marginHorizontal: 8,
    color: '#8E8E93',
  },
  activityText: {
    fontSize: 12,
  },
  noteCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  noteSnippet: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  sharedInfoText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shareIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalSubtitle: {
    fontSize: 15,
    marginBottom: 25,
    lineHeight: 22,
  },
  shareToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  toggleDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 10,
    paddingLeft: 16,
    marginBottom: 30,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  memberBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
  },
  memberRoleLabel: {
    fontSize: 13,
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionSheet: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  actionSheetTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 25,
    textAlign: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  actionTextContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 25,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    right: 40,
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 10,
  },
  toastText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 10,
  },
  sidebarBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebarContainer: {
    width: '80%',
    height: '100%',
  },
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  creationPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconPreviewBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  createInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 15,
  },
  iconSelectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  iconItemBlock: {
    width: 54,
    height: 54,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 15,
    marginBottom: 15,
  },
  confirmCreateButton: {
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  badgeTiny: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityTextContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  inviteCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteSender: {
    fontSize: 15,
    fontWeight: '700',
  },
  inviteWorkspace: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  inviteMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  inviteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inviteBtn: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  declineBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  acceptBtn: {
    // backgroundColor set dynamically
  },
});

export default SharedScreen;
