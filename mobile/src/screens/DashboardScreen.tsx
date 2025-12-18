import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassContainer } from '../components/GlassContainer';
import { useAuthStore } from '../stores/authStore';
import { SkeletonItem } from '../components/SkeletonItem';
import { useTasks } from '../hooks/useTasks';
import { TaskDTO, Priority, TaskFilterDTO } from '@shared/index';
import { StatsView } from '../components/StatsView';

export const DashboardScreen = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // Filter State
    const [filter, setFilter] = useState<TaskFilterDTO>({});
    const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');
    const { tasks, stats, isLoading, createTask, toggleTask } = useTasks(filter);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleCreate = () => {
        if (!newTaskTitle.trim()) return;
        createTask({
            title: newTaskTitle,
            priority: Priority.MEDIUM
        });
        setNewTaskTitle('');
    };

    const handleToggle = (task: TaskDTO) => {
        toggleTask({ id: task.id, completed: !task.completed });
    };

    const togglePriorityFilter = () => {
        setFilter((prev: TaskFilterDTO) => ({
            ...prev,
            priority: prev.priority === Priority.HIGH ? undefined : Priority.HIGH
        }));
    };

    const toggleCompletedFilter = () => {
        setFilter((prev: TaskFilterDTO) => ({
            ...prev,
            completed: prev.completed === true ? undefined : true
        }));
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <GlassContainer style={styles.header}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0]}</Text>
                            <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={() => setViewMode(viewMode === 'list' ? 'stats' : 'list')} style={styles.logoutBtnSmall}>
                                <Text style={styles.logoutTextSmall}>{viewMode === 'list' ? '📊 Stats' : '📝 List'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={logout} style={styles.logoutBtnSmall}>
                                <Text style={styles.logoutTextSmall}>Exit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </GlassContainer>

                {viewMode === 'list' && (
                    <View style={styles.filterRow}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={togglePriorityFilter}>
                                <GlassContainer style={[
                                    styles.filterChip,
                                    filter.priority === Priority.HIGH && styles.filterChipActive
                                ]}>
                                    <Text style={styles.filterText}>🔥 High Priority</Text>
                                </GlassContainer>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleCompletedFilter}>
                                <GlassContainer style={[
                                    styles.filterChip,
                                    filter.completed === true && styles.filterChipActive
                                ]}>
                                    <Text style={styles.filterText}>✅ Completed</Text>
                                </GlassContainer>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>{viewMode === 'list' ? 'Your Tasks' : 'Productivity Stats'}</Text>

                    {isLoading ? (
                        <ScrollView>
                            {[1, 2, 3].map((key) => <SkeletonItem key={key} index={key} />)}
                        </ScrollView>
                    ) : viewMode === 'stats' ? (
                        <StatsView stats={stats} />
                    ) : (
                        <ScrollView style={styles.taskList}>
                            {tasks?.length === 0 && (
                                <GlassContainer style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
                                </GlassContainer>
                            )}
                            {tasks?.map((task) => (
                                <TouchableOpacity key={task.id} onPress={() => handleToggle(task)}>
                                    <GlassContainer style={[
                                        styles.taskItem,
                                        task.completed && styles.taskCompleted
                                    ]}>
                                        <View style={styles.taskRow}>
                                            <View style={[
                                                styles.checkbox,
                                                task.completed && styles.checkboxChecked
                                            ]} />
                                            <Text style={[
                                                styles.taskTitle,
                                                task.completed && styles.taskTitleCompleted
                                            ]}>{task.title}</Text>
                                        </View>
                                    </GlassContainer>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.inputContainer}
                >
                    <GlassContainer style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a new task..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={newTaskTitle}
                            onChangeText={setNewTaskTitle}
                        />
                        <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: { marginBottom: 20 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    date: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    content: { flex: 1 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
    taskList: { flex: 1 },
    emptyContainer: { padding: 20 },
    emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

    taskItem: { marginBottom: 10, padding: 15 },
    taskCompleted: { opacity: 0.6 },
    taskRow: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
        borderColor: '#e94560', marginRight: 12
    },
    checkboxChecked: { backgroundColor: '#e94560' },
    taskTitle: { fontSize: 16, color: '#fff', fontWeight: '500' },
    taskTitleCompleted: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.6)' },

    inputContainer: { marginBottom: 10, marginTop: 10 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', padding: 5 },
    input: { flex: 1, color: '#fff', padding: 10, fontSize: 16 },
    addButton: {
        backgroundColor: '#e94560', width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center', marginLeft: 10
    },
    addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: -2 },

    logoutButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.3)', borderRadius: 12, padding: 16,
        alignItems: 'center', marginTop: 10
    },
    logoutText: { color: '#ff6b6b', fontWeight: 'bold' },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    logoutBtnSmall: { padding: 8, backgroundColor: 'rgba(255,0,0,0.2)', borderRadius: 8 },
    logoutTextSmall: { color: '#ff6b6b', fontSize: 12, fontWeight: 'bold' },

    filterRow: { flexDirection: 'row', marginBottom: 15, height: 50 },
    filterChip: { marginRight: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    filterChipActive: { backgroundColor: 'rgba(233, 69, 96, 0.4)', borderColor: '#e94560' },
    filterText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
