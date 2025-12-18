import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import { GlassContainer } from './GlassContainer';
import { TaskStatsDTO } from '@shared/index';

interface StatsViewProps {
    stats: TaskStatsDTO | undefined;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
    const screenWidth = Dimensions.get('window').width;

    if (!stats) return null;

    const pieData = [
        {
            name: 'High',
            population: stats.tasksByPriority.HIGH,
            color: '#e94560',
            legendFontColor: '#fff',
            legendFontSize: 12,
        },
        {
            name: 'Medium',
            population: stats.tasksByPriority.MEDIUM,
            color: '#0f3460',
            legendFontColor: '#fff',
            legendFontSize: 12,
        },
        {
            name: 'Low',
            population: stats.tasksByPriority.LOW,
            color: '#16213e',
            legendFontColor: '#fff',
            legendFontSize: 12,
        },
    ];

    const progressData = {
        labels: ['Completed'],
        data: [stats.completionRate || 0]
    };

    return (
        <View style={styles.container}>
            <GlassContainer style={styles.card}>
                <Text style={styles.title}>Task Priorities</Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 80}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor={'population'}
                    backgroundColor={'transparent'}
                    paddingLeft={'15'}
                    absolute
                />
            </GlassContainer>

            <GlassContainer style={styles.card}>
                <Text style={styles.title}>Completion Rate</Text>
                <ProgressChart
                    data={progressData}
                    width={screenWidth - 80}
                    height={150}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                        backgroundGradientFrom: '#1E2923',
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: '#08130D',
                        backgroundGradientToOpacity: 0,
                        color: (opacity = 1) => `rgba(233, 69, 96, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    hideLegend={false}
                />
                <Text style={styles.statText}>
                    {stats.completedTasks} / {stats.totalTasks} Tasks Done
                </Text>
            </GlassContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingBottom: 20 },
    card: { marginBottom: 20, alignItems: 'center', paddingVertical: 10 },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    statText: { color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 16 },
});
